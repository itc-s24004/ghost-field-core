import type { GF_EX_GameData } from "../game/action";
import type { GF_GameValue, GF_Player, GF_PlayerStatusType } from "../player/player";
import type { GF_Card_ID, GF_CardComponent } from "./component";
import { GF_Element } from "./element";
export type GF_CardUseOptions = {
    hp?: number;
    mp?: number;
    gold?: number;
};
export type GF_CardMixOptions<EX_Card extends GF_EX_GameData = {}> = GF_CardUseOptions & {
    cards?: GF_Card<EX_Card>[];
};
export declare class GF_Card<EX_Card extends GF_EX_GameData = {}> {
    #private;
    /**
     * カードを使用する（攻撃・売却・両替・回復）\
     * 攻撃カード以外を使用した場合、エラーが発生します
     * @param src
     * @param baseCard
     * @param options
     * @returns
     */
    static useOffensive<EX_Card extends GF_EX_GameData = {}>(src: GF_Player, baseCard: GF_Card<EX_Card>, options?: GF_CardMixOptions<EX_Card>): GF_CardMixData_Attack<EX_Card> | GF_CardMixData_Sell<EX_Card> | GF_CardMixData_Exchange<EX_Card> | GF_CardMixData_Heal<EX_Card>;
    static useDefensive<EX_Card extends GF_EX_GameData = {}>(src: GF_Player, baseCard?: GF_Card<EX_Card>, options?: GF_CardMixOptions<EX_Card>): GF_CardMixData_Defense<EX_Card>;
    constructor(component: GF_CardComponent<EX_Card>);
    get id(): GF_Card_ID;
    get element(): GF_Element;
    get isMagic(): boolean;
    get isAttack(): boolean;
    /**
     * 使用オプションが利用可能かどうか
     */
    get canUseOptions(): boolean;
    get cost(): GF_GameValue | undefined;
    get price(): number;
    get name(): string;
    get weight(): number;
    toString(): string;
}
export type GF_CardMixData_Offensive<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Attack<EX_Card> | GF_CardMixData_Heal<EX_Card> | GF_CardMixData_Exchange<EX_Card> | GF_CardMixData_Sell<EX_Card>;
export type GF_CardMixData_Defensive<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Defense<EX_Card>;
export type GF_CardMixData_All<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Offensive<EX_Card> | GF_CardMixData_Defensive<EX_Card>;
export type GF_CardMixData<EX_Card extends GF_EX_GameData = {}> = {
    type: string;
    cards: GF_Card<EX_Card>[];
    element: GF_Element;
    isMagic: boolean;
    cost: number;
};
export type GF_CardMixData_Attack<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "attack";
    value: number;
    rate: number;
};
export type GF_CardMixData_Defense<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "defense";
    value: number;
};
export type GF_CardMixData_Heal<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "heal";
    healType: GF_PlayerStatusType;
    value: number;
};
export type GF_CardMixData_Exchange<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "exchange";
    hp: number;
    mp: number;
    gold: number;
};
export type GF_CardMixData_Sell<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "sell";
    value: number;
};
