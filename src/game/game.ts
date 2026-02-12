import { GF_Card } from "../card/card.js";
import type { GF_Card_ID, GF_CardComponent } from "../card/component.js";
import { GF_Element } from "../card/element.js";
import { GF_Deck } from "../deck/deck.js";
import { GF_Player } from "../player/player.js";
import { GF_CardUseOptions } from "../util/card/index.js";
import { GF_Util } from "../util/index.js";
import type { GF_EX_GameData, GF_SystemAction } from "./action.js";
import { GF_Error_Undefined } from "./error.js";
import type { GF_GameEventMap, GF_SystemEventDataMap } from "./events/index.js";





export class GF_Game<EX_Card extends GF_EX_GameData = {}, EX_Meta extends GF_EX_GameData = {}> {
    #systemActionQueue: Readonly<GF_SystemAction<EX_Card>>[] = [];

    /**現在の攻撃アクション */
    #currentAction: GF_SystemAction<EX_Card> | undefined = undefined;
    /**
     * 現在の攻撃アクションを取得します。\
     * 入力するプレイヤーが攻撃フェーズの場合は undefined になります。
     */
    get currentAction() {//!!! data clone
        if (!this.#currentAction) this.#currentAction = this.#systemActionQueue.shift();
        return this.#currentAction;
    }

    
    #players: GF_Player<EX_Card>[] = [];
    
    /**現在攻撃中のプレイヤー */
    #currentPlayer: GF_Player<EX_Card> | undefined = undefined;
    get currentPlayer() {//!!! data clone
        if (this.currentAction) return this.currentAction.target;
        return this.#currentPlayer;
    }

    get #nextPlayer() {
        if (this.#players.length === 0) return undefined;
        let currentIndex = this.#players.indexOf(this.#currentPlayer!);
        for (let i = 0; i < this.#players.length; i++) {
            currentIndex++;
            const player = this.getPlayer(currentIndex);
            if (player && player.isAlive) return player;
        }
    }

    getPlayer(index: number) {
        return this.#players[index % this.#players.length];
    }

    get currentPlayerIndex() {
        if (!this.currentPlayer) return -1;
        return this.#players.indexOf(this.currentPlayer);
    }

    get playerCount() {
        return this.#players.length;
    }

    getPlayerIndex(player: GF_Player<EX_Card>) {
        return this.#players.indexOf(player);
    }

    #winner: GF_Player<EX_Card> | undefined = undefined;
    get winner() {
        return this.#winner;
    }


    #deck: GF_Deck<EX_Card>;
    
    #meta: EX_Meta | undefined = undefined;
    
    #events: GF_GameEventMap<EX_Card>;
    constructor(initialData: GF_Initial_Game<EX_Card, EX_Meta>, options: GF_GameOptions<EX_Card> = {}) {
        const {
            secureMode = false,
            events = {}
        } = options;
        this.#events = events;

        this.#deck = new GF_Deck<EX_Card>(initialData.cards);
        this.#meta = initialData.meta;
    }


    reset(playerCount: number) {
        this.#players = new Array(playerCount).fill(null).map(() => new GF_Player<EX_Card>(this.#deck));
        for (let i = 0; i < 10; i++) {
            this.#players.forEach( player => {
                const result = player.deck.drawCard();
                this.#events.onDrawCard?.({
                    player,
                    ...result
                });
                
            });
        }
        this.#currentPlayer = this.#players[0];
    }


    getPlayerByIndex(index: number): GF_Player<EX_Card> | undefined {
        return this.#players[index];
    }



    next(useCards: (GF_Card<EX_Card> | GF_Card_ID)[], targetIndex: number, options?: GF_CardUseOptions) {
        if (this.winner) throw new GF_Error_Undefined("ゲームが終了しています。");

        const target = this.#players[targetIndex];
        if (!target) throw new GF_Error_Undefined("指定されたターゲットプレイヤーが存在しません。");
        
        const player = this.currentPlayer;
        if (!player) throw new GF_Error_Undefined("現在のプレイヤーが存在しません。");

        const cards = useCards.map((card) => (
            card instanceof GF_Card ? card : this.#deck.getCardByID(card)
        )).filter(card => card !== undefined);

        const base = cards[0];
        const multiCards = cards.slice(1);

        if (this.currentAction) {//防御フェーズ
            this.#defensiveAction(player, base, multiCards, options);

        } else {//攻撃フェーズ
            this.#offensiveAction(player, target, base, multiCards, options);
            //次のプレイヤーへ
            this.#currentPlayer = this.#nextPlayer;

        }

        //プレイヤーが死亡
        if (!player.isAlive) {
            this.#events.onDeath?.({ player});

        } else {
            for (let i = 0; i < cards.length; i++) {
                const result = player.deck.drawCard();
                this.#events.onDrawCard?.({
                    player,
                    ...result
                });
            }

        }

        this.#nextTick();
        
    }


    addAction(action: GF_SystemAction<EX_Card>, push: boolean = false) {
        GF_Util.deepFreeze(action);
        if (push) {
            this.#systemActionQueue.push(action);
        } else {
            this.#systemActionQueue.unshift(action);
        }
    }


    #offensiveAction(player: GF_Player<EX_Card>, target: GF_Player<EX_Card>, baseCard: GF_Card<EX_Card> | undefined, multiCards: GF_Card<EX_Card>[], options: GF_CardUseOptions = {}) {
        //カード未指定かつ使用可能なカードが無い場合はドローのみ行う
        if (!baseCard) {
            if (!player.deck.hasCanUseCard()) {
                const result = player.deck.drawCard();
                this.#events.onDrawCard?.({
                    player,
                    ...result
                });
                return;

            } else {
                throw new GF_Error_Undefined("使用可能なカードが存在する場合、カードを指定する必要があります。");

            }
        }
        
        const data = GF_Util.useOffensive(player, baseCard, {
            cards: multiCards,
            ...options
        });
        const result = player.deck.useCard(data);
        this.#events.onUseCard?.({ type: "offensive", player, target, cards: [baseCard, ...multiCards], result });
        const type = data.type;

        if (type === "attack") {
            if (data.rate < 1) {
                this.#players.forEach(tgt => {
                    if (tgt === player) return;
                    const isMiss = Math.random() > data.rate;
                    const action: GF_SystemAction<EX_Card> = {
                        ...data,
                        src: player,
                        target: tgt,
                        isMiss
                    };
                    this.addAction(action);
                });
            } else {
                const action: GF_SystemAction<EX_Card> = {
                    ...data,
                    src: player,
                    target,
                    isMiss: false
                };
                this.addAction(action);
            }

        } else if (type === "exchange") {
            player.hp = data.hp;
            player.mp = data.mp;
            player.gold = data.gold;
            this.#events.onExchange?.({ player, action: data });

        } else if (type === "heal") {
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

        } else if (type === "sell") {//!!! 未実装

        }
    }


    #defensiveAction(player: GF_Player<EX_Card>, base: GF_Card<EX_Card> | undefined, multiCards: GF_Card<EX_Card>[], options: GF_CardUseOptions = {}) {
        if (!this.currentAction) return;

        //カードの合成
        const data = GF_Util.useDefensive(player, base, {
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
            const nextAction: GF_SystemEventDataMap<EX_Card>["onDamage"]["nextAction"] = {
                ghost: true,
                trap: true
            };
            
            const res: GF_SystemEventDataMap<EX_Card>["onDamage"] = {
                player: this.currentAction.target,
                damageSource: this.currentAction.src,
                damage,
                nextAction
            };
            //ダメージイベント発火
            this.#events.onDamage?.(res);

            //ゴーストの祓い抽選と行動処理
            if (nextAction.ghost) this.#ghostExorcism(this.currentAction.target);

            //プレイヤーが死亡
            if (!player.isAlive) {
                this.#events.onDeath?.({ player });
                if (nextAction.trap) this.#trapAction(this.currentAction.target, this.currentAction.src);
            }

            //ゴーストの行動処理
            if (player.isAlive) this.#ghostAction(player, this.currentAction.src);

        }
        
        //防御フェーズ終了
        this.#currentAction = undefined;

    }



    /**
     * ゴーストが祓われるかの抽選を行います
     * @param player 
     */
    #ghostExorcism(player: GF_Player<EX_Card>) {
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
    #ghostAction(player: GF_Player<EX_Card>, damageSource: GF_Player<EX_Card>) {
        if (!player.ghost) return;
        
    }

    /**
     * トラップの処理を行います
     * @param player 
     * @param damageSource 
     */
    #trapAction(player: GF_Player<EX_Card>, damageSource: GF_Player<EX_Card>) {

    }



    /**
     * 次の攻撃アクションを処理します
     * @returns 
     */
    #nextTick() {
        while (this.#systemActionQueue.length > 0) {
            if (!this.currentAction) break;

            //攻撃イベント発火
            this.#events.onAttack?.({ action: this.currentAction });
            
            if (this.currentAction.isMiss) {
                continue;

            } else if (this.currentAction.src === this.currentAction.target) {
                this.#events.onDamage?.({
                    player: this.currentAction.target,
                    damageSource: this.currentAction.src,
                    damage: this.currentAction.value,
                    nextAction: {
                        ghost: false,
                        trap: false
                    }
                });
                continue;

            }
        }
        
        //ゲーム終了判定
        const alivePlayers = this.#players.filter(p => p.isAlive);
        const gameEnd = alivePlayers.length <= 1;

        if (gameEnd) {
            this.#winner = alivePlayers[0];
            this.#systemActionQueue = [];
            this.#currentAction = undefined;
            this.#events.onGameEnd?.({ winner: this.#winner });
            return;
        }
    }



    get info(): GF_GameInfo<EX_Card, EX_Meta> {
        return {
            cards: this.#deck.allCards.map(c => c.component),
            meta: this.#meta
        }
    }
}

export type GF_GameOptions<EX_Card extends GF_EX_GameData = {}> = {

    /**!!!未実装
     * データの受け渡しの際にクローンを作成するかどうか
     */
    secureMode?: boolean;

    events?: GF_GameEventMap<EX_Card>;
}

export type GF_Initial_Game<EX_Card extends GF_EX_GameData = {}, EX_Meta extends GF_EX_GameData = {}> = {
    cards: GF_CardComponent<EX_Card>[];
    meta: EX_Meta | undefined;
}




export type GF_GameInfo<EX_Card extends GF_EX_GameData, EX_Meta extends GF_EX_GameData> = GF_Initial_Game<EX_Card, EX_Meta> & {
    meta: EX_Meta | undefined;
}