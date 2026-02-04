import { GF_Element } from "../card/element";
import { GF_PlayerDeck, type GF_Deck } from "../deck/deck";
import type { GF_EX_GameData } from "../game/action";
import { GF_EffectManager } from "./effect";




export type GF_GameValue = number | GF_PlayerStatusType;

export type GF_PlayerStatusType = "hp" | "mp" | "gold";

export type GF_PlayerStatus = {
    [key in GF_PlayerStatusType]: number;
}

export class GF_Player<EX_Card extends GF_EX_GameData = {}>  {
    #stats: GF_PlayerStatus;
    
    #effects: GF_EffectManager = new GF_EffectManager();
    get effects() {
        return this.#effects;
    }

    #ghost: GF_Element = GF_Element.Empty;
    get ghost() {
        if (this.#ghost === GF_Element.Empty) return;
        return this.#ghost;
    }

    set ghost(value: GF_Element | undefined) {
        this.#ghost = value ?? GF_Element.Empty;
    }


    #deck: GF_PlayerDeck<EX_Card>;
    constructor(deck: GF_Deck<EX_Card>, stats?: GF_PlayerStatus) {
        this.#stats = stats ?? { hp: 40, mp: 20, gold: 10 };
        this.#deck = new GF_PlayerDeck<EX_Card>(this, deck);
    }

    get deck() {
        return this.#deck;
    }


    get hp(): number {
        return this.#stats.hp;
    }
    set hp(value: number) {
        this.#stats.hp = value;
    }


    get mp(): number {
        return this.#stats.mp;
    }
    set mp(value: number) {
        this.#stats.mp = value;
    }


    get gold(): number {
        return this.#stats.gold;
    }
    set gold(value: number) {
        this.#stats.gold = value;
    }


    get status(): GF_PlayerStatus {
        return this.#stats;
        // return structuredClone(this.#stats);
    }


    get isAlive(): boolean {
        return this.#stats.hp > 0;
    }

}