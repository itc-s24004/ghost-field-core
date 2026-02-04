import { GF_Element } from "../card/element";
import { GF_PlayerDeck, type GF_Deck } from "../deck/deck";
import type { GF_EX_GameData } from "../game/action";
import { GF_EffectManager } from "./effect";
export type GF_GameValue = number | GF_PlayerStatusType;
export type GF_PlayerStatusType = "hp" | "mp" | "gold";
export type GF_PlayerStatus = {
    [key in GF_PlayerStatusType]: number;
};
export declare class GF_Player<EX_Card extends GF_EX_GameData = {}> {
    #private;
    get effects(): GF_EffectManager;
    get ghost(): GF_Element | undefined;
    set ghost(value: GF_Element | undefined);
    constructor(deck: GF_Deck<EX_Card>, stats?: GF_PlayerStatus);
    get deck(): GF_PlayerDeck<EX_Card>;
    get hp(): number;
    set hp(value: number);
    get mp(): number;
    set mp(value: number);
    get gold(): number;
    set gold(value: number);
    get status(): GF_PlayerStatus;
    get isAlive(): boolean;
}
