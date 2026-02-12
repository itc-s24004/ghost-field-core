import { GF_Card } from "../../card/card.js";
import { GF_Element } from "../../card/element.js";
import { GF_EX_GameData } from "../../game/action.js";
import { GF_PlayerStatus, GF_PlayerStatusType } from "../../player/player.js";
export type GF_CardUseOptions = {
    hp?: number;
    mp?: number;
    gold?: number;
};
export type GF_CardMixOptions<EX_Card extends GF_EX_GameData = {}> = GF_CardUseOptions & {
    cards?: GF_Card<EX_Card>[];
};
export declare function useOffensive<EX_Card extends GF_EX_GameData = {}>(src: GF_PlayerStatus, baseCard: GF_Card<EX_Card>, options?: GF_CardMixOptions<EX_Card>): GF_CardMixData_Attack<EX_Card> | GF_CardMixData_Sell<EX_Card> | GF_CardMixData_Exchange<EX_Card> | GF_CardMixData_Heal<EX_Card>;
export declare function useDefensive<EX_Card extends GF_EX_GameData = {}>(src: GF_PlayerStatus, baseCard?: GF_Card<EX_Card>, options?: GF_CardMixOptions<EX_Card>): GF_CardMixData_Defense<EX_Card>;
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
