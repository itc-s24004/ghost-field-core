import { GF_Card } from "../card/card.js";
import { GF_Element } from "../card/element.js";
import { GF_Deck } from "../deck/deck.js";
import { CategoryEventEmitter } from "../emitter/emitter.js";
import { GF_Player } from "../player/player.js";
import { GF_Util } from "../util/index.js";
import { GF_Error_Undefined } from "./error.js";
export class GF_Game extends CategoryEventEmitter {
    #systemActionQueue = [];
    /**現在の攻撃アクション */
    #currentAction = undefined;
    /**
     * 現在の攻撃アクションを取得します。\
     * 入力するプレイヤーが攻撃フェーズの場合は undefined になります。
     */
    get currentAction() {
        if (!this.#currentAction)
            this.#currentAction = this.#systemActionQueue.shift();
        return this.#currentAction;
    }
    #players = [];
    get allPlayers() {
        return this.#isPlaying ? this.#players : [];
    }
    /**現在攻撃中のプレイヤー */
    #currentPlayer = undefined;
    get currentPlayer() {
        if (this.currentAction)
            return this.currentAction.target;
        return this.#currentPlayer;
    }
    get #nextPlayer() {
        if (this.#players.length === 0)
            return undefined;
        let currentIndex = this.#players.indexOf(this.#currentPlayer);
        for (let i = 0; i < this.#players.length; i++) {
            currentIndex++;
            const player = this.getPlayer(currentIndex);
            if (player && player.isAlive)
                return player;
        }
    }
    getPlayer(index) {
        return this.#players[index % this.#players.length];
    }
    get currentPlayerIndex() {
        if (!this.currentPlayer)
            return -1;
        return this.#players.indexOf(this.currentPlayer);
    }
    get playerCount() {
        return this.#players.length;
    }
    getPlayerIndex(player) {
        return this.#players.indexOf(player);
    }
    #isPlaying = false;
    get isPlaying() {
        return this.#isPlaying;
    }
    #winner = undefined;
    get winner() {
        return this.#winner;
    }
    #deck;
    #meta = undefined;
    get initData() {
        return {
            cards: this.#deck.allCards.map(c => c.component),
            meta: this.#meta
        };
    }
    constructor(initialData, options = {}) {
        super();
        const { secureMode = false, events = {} } = options;
        this.#deck = new GF_Deck(initialData.cards);
        this.#meta = initialData.meta;
    }
    reset(playerCount) {
        this.#players = new Array(playerCount).fill(null).map(() => new GF_Player(this.#deck));
        for (let i = 0; i < 5; i++) {
            this.#players.forEach(player => {
                const { drawnCard, removedCard } = player.deck.drawCard();
                this.emit("onDrawCard", {
                    player,
                    drawnCard,
                    removedCard
                });
            });
        }
        this.#winner = undefined;
        this.#currentPlayer = this.#players[0];
        this.#isPlaying = true;
    }
    getPlayerByIndex(index) {
        return this.#players[index];
    }
    next(useCards, targetIndex, options) {
        if (!this.isPlaying)
            throw new GF_Error_Undefined("ゲームが終了しています。");
        const target = this.#players[targetIndex];
        if (!target)
            throw new GF_Error_Undefined("指定されたターゲットプレイヤーが存在しません。");
        const player = this.currentPlayer;
        if (!player)
            throw new GF_Error_Undefined("現在のプレイヤーが存在しません。");
        const cards = useCards.map((card) => (card instanceof GF_Card ? card : this.#deck.getCardByID(card))).filter(card => card !== undefined);
        const base = cards[0];
        const multiCards = cards.slice(1);
        if (this.currentAction) { //防御フェーズ
            this.#defensiveAction(player, base, multiCards, options);
        }
        else { //攻撃フェーズ
            this.#offensiveAction(player, target, base, multiCards, options);
            //次のプレイヤーへ
            this.#currentPlayer = this.#nextPlayer;
        }
        //プレイヤーが死亡
        if (player.isAlive) {
            for (let i = 0; i < cards.length; i++) {
                const result = player.deck.drawCard();
                super.emit("onDrawCard", {
                    player,
                    ...result
                });
            }
        }
        this.#nextTick();
    }
    addAction(action, push = false) {
        GF_Util.deepFreeze(action);
        if (push) {
            this.#systemActionQueue.push(action);
        }
        else {
            this.#systemActionQueue.unshift(action);
        }
    }
    #offensiveAction(player, target, baseCard, multiCards, options = {}) {
        //カード未指定かつ使用可能なカードが無い場合はドローのみ行う
        if (!baseCard) {
            if (!player.deck.hasCanUseCard()) {
                const result = player.deck.drawCard();
                super.emit("onDrawCard", {
                    player,
                    ...result
                });
                return;
            }
            else {
                throw new GF_Error_Undefined("使用可能なカードが存在する場合、カードを指定する必要があります。");
            }
        }
        const data = GF_Util.useOffensive(player, baseCard, {
            cards: multiCards,
            ...options
        });
        const result = player.deck.useCard(data);
        super.emit("onUseCard", { type: "offensive", player, target, cards: [baseCard, ...multiCards], result });
        const type = data.type;
        if (type === "attack") {
            if (data.rate < 1) {
                this.#players.forEach(tgt => {
                    if (tgt === player)
                        return;
                    const isMiss = Math.random() > data.rate;
                    const action = {
                        ...data,
                        src: player,
                        target: tgt,
                        isMiss
                    };
                    this.addAction(action);
                });
            }
            else {
                const action = {
                    ...data,
                    src: player,
                    target,
                    isMiss: false
                };
                this.addAction(action);
            }
        }
        else if (type === "exchange") {
            player.hp = data.hp;
            player.mp = data.mp;
            player.gold = data.gold;
            super.emit("onExchange", { player, action: data });
        }
        else if (type === "heal") {
            switch (data.healType) {
                case "hp":
                    target.hp += data.value;
                    break;
                case "mp":
                    target.mp += data.value;
                    break;
                case "gold":
                    target.gold += data.value;
                    break;
            }
            super.emit("onHeal", { player: target, action: data });
        }
        else if (type === "sell") { //!!! 未実装
        }
    }
    #defensiveAction(player, base, multiCards, options = {}) {
        if (!this.currentAction)
            return;
        //カードの合成
        const data = GF_Util.useDefensive(player, base, {
            cards: multiCards,
            ...options
        });
        //手持ちのカードを使用
        const result = player.deck.useCard(data);
        //防御カード使用イベント発火
        super.emit("onUseCard", { type: "defensive", player, cards: base ? [base, ...multiCards] : multiCards, result });
        const damage = this.currentAction.value - data.value;
        //防御イベント発火
        super.emit("onDefense", {
            player,
            damageSource: this.currentAction.src,
        });
        if (damage > 0)
            this.addDamage(player, damage, this.currentAction.src);
        //防御フェーズ終了
        this.#currentAction = undefined;
    }
    /**
     * ゴーストが祓われるかの抽選を行います
     * @param player
     */
    #ghostExorcism(player) {
        if (player.ghost && Math.random() < 0.05) {
            player.ghost = GF_Element.Empty;
            super.emit("onRemoveGhost", { player });
        }
    }
    /**
     * ゴーストの行動処理を行います
     * @param player
     * @param damageSource
     */
    #ghostAction(player, damageSource) {
        if (!player.ghost)
            return;
    }
    /**
     * トラップの処理を行います
     * @param player
     * @param damageSource
     */
    #trapAction(player, damageSource) {
    }
    /**
     * 次の攻撃アクションを処理します
     * @returns
     */
    #nextTick() {
        while (this.#systemActionQueue.length > 0) {
            if (!this.currentAction)
                break;
            //防御側が死亡している場合は次のアクションへ
            if (!this.currentAction.target.isAlive) {
                this.#currentAction = undefined;
                continue;
            }
            //攻撃イベント発火
            super.emit("onAttack", { action: this.currentAction });
            if (this.currentAction.isMiss) {
                this.#currentAction = undefined;
                continue;
            }
            else if (this.currentAction.src === this.currentAction.target) {
                this.addDamage(this.currentAction.target, this.currentAction.value, this.currentAction.src);
                this.#currentAction = undefined;
                continue;
            }
            else {
                break;
            }
        }
        //ゲーム終了判定
        const isGameEnd = this.#checkGameEnd();
        if (!isGameEnd) {
            this.emit("onNextTurn", {
                player: this.currentPlayer
            });
        }
    }
    kill(player) {
        this.addDamage(player, player.hp, player);
    }
    addDamage(player, damage, damageSource) {
        player.hp -= damage;
        const nextAction = {
            ghost: true,
            trap: true
        };
        //ダメージイベント発火
        super.emit("onDamage", {
            player,
            damageSource,
            damage,
            nextAction
        });
        //ゴーストの祓い抽選と行動処理
        if (nextAction.ghost)
            this.#ghostExorcism(player);
        //プレイヤーが死亡
        if (!player.isAlive) {
            super.emit("onDeath", { player });
            if (nextAction.trap)
                this.#trapAction(player, damageSource);
        }
        //ゴーストの行動処理
        if (player.isAlive)
            this.#ghostAction(player, damageSource);
        //ゲーム終了判定
        this.#nextTick();
    }
    #checkGameEnd() {
        const alivePlayers = this.#players.filter(p => p.isAlive);
        if (alivePlayers.length <= 1) {
            this.#systemActionQueue = [];
            this.#currentAction = undefined;
            this.#winner = alivePlayers[0];
            this.#isPlaying = false;
            super.emit("onGameEnd", { winner: this.#winner });
            return true;
        }
        return false;
    }
    get info() {
        return {
            cards: this.#deck.allCards.map(c => c.component),
            meta: this.#meta
        };
    }
}
