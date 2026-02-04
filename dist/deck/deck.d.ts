import { GF_Card, type GF_CardMixData_All } from "../card/card.js";
import type { GF_Card_ID, GF_CardComponent } from "../card/component.js";
import type { GF_EX_GameData } from "../game/action.js";
import type { GF_Player } from "../player/player.js";
export declare class GF_Deck<EX_Card extends GF_EX_GameData = {}> {
    #private;
    constructor(initialData: GF_CardComponent<EX_Card>[]);
    get allCards(): GF_Card<EX_Card>[];
    /**
     * 指定したカードIDのカードを取得する
     * @param cardID
     * @returns
     */
    getCardByID(cardID: GF_Card_ID): GF_Card<EX_Card> | undefined;
    /**
     * カードを1枚引く
     * @returns
     */
    drawCard(): GF_Card<EX_Card>;
}
/**
 * プレイヤーのデッキ
 */
export declare class GF_PlayerDeck<EX_Card extends GF_EX_GameData = {}> {
    #private;
    constructor(src: GF_Player<EX_Card>, deck: GF_Deck<EX_Card>, maxHandSize?: number, maxMagicStackSize?: number);
    get totalHandCount(): number;
    get totalMagicStackCount(): number;
    get hand(): Map<GF_Card<EX_Card>, number>;
    get magicStack(): Map<GF_Card<EX_Card>, number>;
    /**
     * 指定したカードが手札に存在するかどうかを取得する
     * @param card
     * @returns
     */
    hasCard(card: GF_Card<EX_Card>): boolean;
    /**
     * 指定したカードの枚数を取得する
     * @param card
     * @returns
     */
    getCardCount(card: GF_Card<EX_Card>): number;
    getMagicStackCount(card: GF_Card<EX_Card>): number;
    /**
     * 指定したカードが手札に指定枚数以上あるかどうかを取得する
     * @param cards
     * @returns
     */
    hasCards(cards: Map<GF_Card<EX_Card>, number>): boolean;
    hasMagicCards(cards: Map<GF_Card<EX_Card>, number>): boolean;
    hasAttackCard(): boolean;
    /**
     * 魔法でない攻撃カードが手札に存在するかどうか
     * @returns
     */
    hasCanUseCard(): boolean;
    setCard(card: GF_Card<EX_Card>, count: number): void;
    setMagicStack(card: GF_Card<EX_Card>, count: number): void;
    /**
     * カードを1枚引く
     */
    drawCard(): GF_PlayerDrawResult<EX_Card>;
    /**
     * 指定したカードを使用する\
     * 効果処理は行いません
     * @param data
     * @returns
     */
    useCard(data: GF_CardMixData_All<EX_Card>): GF_UseCardResult<EX_Card>;
    addMagicStack(...cards: GF_Card<EX_Card>[]): void;
    addCards(...cards: GF_Card<EX_Card>[]): GF_Card<EX_Card>[];
    addCard(card: GF_Card<EX_Card>): GF_Card<EX_Card> | undefined;
    getRandomHandCard(useWeight?: boolean): GF_Card<EX_Card>;
}
export type GF_PlayerHand<EX_Card extends GF_EX_GameData = {}> = {
    hand: Map<GF_Card<EX_Card>, number>;
    magicStack: Map<GF_Card<EX_Card>, number>;
};
export type GF_UsePlayerCardResult<EX_Card extends GF_EX_GameData> = {
    /**hpの変化量 */
    d_hp: number;
    /**mpの変化量 */
    d_mp: number;
    /**goldの変化量 */
    d_gold: number;
    removedCards: GF_Card<EX_Card>[];
};
export type GF_PlayerDrawResult<EX_Card extends GF_EX_GameData> = {
    drawnCard: GF_Card<EX_Card>;
    removedCard: GF_Card<EX_Card> | undefined;
};
export type GF_UseCardResult<EX_Card extends GF_EX_GameData> = {
    usedCards: Map<GF_Card<EX_Card>, number>;
    stackCards: Map<GF_Card<EX_Card>, number>;
};
