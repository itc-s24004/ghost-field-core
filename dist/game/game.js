import { GF_Card } from "../card/card";
import { GF_Element } from "../card/element";
import { GF_Deck } from "../deck/deck";
import { GF_Player } from "../player/player";
import { GF_Error_Undefined } from "./error";
export class GF_Game {
    #systemActionQueue = [];
    /**現在の攻撃アクション */
    #currentAction = null;
    /**
     * 現在の攻撃アクションを取得します。\
     * 入力するプレイヤーが攻撃フェーズの場合は null になります。
     */
    get currentAction() {
        return this.#currentAction;
    }
    #players = [];
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
    #winner = undefined;
    get winner() {
        return this.#winner;
    }
    #deck;
    #events;
    constructor(initialData, options = {}) {
        const { secureMode = false, events = {} } = options;
        this.#events = events;
        this.#deck = new GF_Deck(initialData.cards);
    }
    reset(playerCount) {
        this.#players = new Array(playerCount).fill(null).map(() => new GF_Player(this.#deck));
        for (let i = 0; i < 10; i++) {
            this.#players.forEach(player => {
                const { drawnCard, removedCard } = player.deck.drawCard();
                this.#events.onDrawCard?.({
                    player,
                    drawnCard,
                    removedCard
                });
            });
        }
        this.#currentPlayer = this.#players[0];
    }
    getPlayerByIndex(index) {
        return this.#players[index];
    }
    next(useCards, targetIndex, options) {
        if (this.winner)
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
        if (!player.isAlive)
            this.#events.onDeath?.({ player });
        this.#nextTick();
    }
    #offensiveAction(player, target, baseCard, multiCards, options = {}) {
        //カード未指定かつ使用可能なカードが無い場合はドローのみ行う
        if (!baseCard) {
            if (!player.deck.hasCanUseCard()) {
                const { drawnCard, removedCard } = player.deck.drawCard();
                this.#events.onDrawCard?.({
                    player,
                    drawnCard,
                    removedCard
                });
                return;
            }
            else {
                throw new GF_Error_Undefined("使用可能なカードが存在する場合、カードを指定する必要があります。");
            }
        }
        const data = GF_Card.useOffensive(player, baseCard, {
            cards: multiCards,
            ...options
        });
        const result = player.deck.useCard(data);
        this.#events.onUseCard?.({ type: "offensive", player, target, cards: [baseCard, ...multiCards], result });
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
                    this.#systemActionQueue.unshift(action);
                });
            }
            else {
                const action = {
                    ...data,
                    src: player,
                    target,
                    isMiss: false
                };
                this.#systemActionQueue.unshift(action);
            }
        }
        else if (type === "exchange") {
            player.hp = data.hp;
            player.mp = data.mp;
            player.gold = data.gold;
            this.#events.onExchange?.({ player, action: data });
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
            this.#events.onHeal?.({ player: target, action: data });
        }
        else if (type === "sell") { //!!! 未実装
        }
    }
    #defensiveAction(player, base, multiCards, options = {}) {
        if (!this.currentAction)
            return;
        //カードの合成
        const data = GF_Card.useDefensive(player, base, {
            cards: multiCards,
            ...options
        });
        //手持ちのカードを使用
        const result = player.deck.useCard(data);
        //防御カード使用イベント発火
        this.#events.onUseCard?.({ type: "defensive", player, cards: base ? [base, ...multiCards] : multiCards, result });
        const damage = this.currentAction.value - data.value;
        //防御イベント発火
        this.#events.onDefense?.({
            player,
            damageSource: this.currentAction.src,
        });
        if (damage > 0) {
            this.currentAction.target.hp -= damage;
            const nextAction = {
                ghost: true,
                trap: true
            };
            const res = {
                player: this.currentAction.target,
                damageSource: this.currentAction.src,
                damage,
                nextAction
            };
            //ダメージイベント発火
            this.#events.onDamage?.(res);
            //ゴーストの祓い抽選と行動処理
            if (nextAction.ghost)
                this.#ghostExorcism(this.currentAction.target);
            //プレイヤーが死亡
            if (!player.isAlive) {
                this.#events.onDeath?.({ player });
                if (nextAction.trap)
                    this.#trapAction(this.currentAction.target, this.currentAction.src);
            }
            //ゴーストの行動処理
            if (player.isAlive)
                this.#ghostAction(player, this.currentAction.src);
        }
        //防御フェーズ終了
        this.#currentAction = null;
    }
    /**
     * ゴーストが祓われるかの抽選を行います
     * @param player
     */
    #ghostExorcism(player) {
        if (player.ghost && Math.random() < 0.05) {
            player.ghost = GF_Element.Empty;
            this.#events.onRemoveGhost?.({ player });
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
            const action = this.#systemActionQueue.shift();
            if (!action)
                return;
            //攻撃イベント発火
            this.#events.onAttack?.({ action });
            if (action.isMiss) {
                continue;
            }
            else if (action.src === action.target) {
                this.#events.onDamage?.({
                    player: action.target,
                    damageSource: action.src,
                    damage: action.value,
                    nextAction: {
                        ghost: false,
                        trap: false
                    }
                });
                continue;
            }
            this.#currentAction = action;
        }
        //ゲーム終了判定
        const alivePlayers = this.#players.filter(p => p.isAlive);
        const gameEnd = alivePlayers.length <= 1;
        if (gameEnd) {
            this.#winner = alivePlayers[0];
            this.#events.onGameEnd?.({ winner: this.#winner });
            return;
        }
    }
}
