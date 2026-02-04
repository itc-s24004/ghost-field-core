import { GF_Element } from "../card/element";
import { GF_PlayerDeck } from "../deck/deck";
import { GF_EffectManager } from "./effect";
export class GF_Player {
    #stats;
    #effects = new GF_EffectManager();
    get effects() {
        return this.#effects;
    }
    #ghost = GF_Element.Empty;
    get ghost() {
        if (this.#ghost === GF_Element.Empty)
            return;
        return this.#ghost;
    }
    set ghost(value) {
        this.#ghost = value ?? GF_Element.Empty;
    }
    #deck;
    constructor(deck, stats) {
        this.#stats = stats ?? { hp: 40, mp: 20, gold: 10 };
        this.#deck = new GF_PlayerDeck(this, deck);
    }
    get deck() {
        return this.#deck;
    }
    get hp() {
        return this.#stats.hp;
    }
    set hp(value) {
        this.#stats.hp = value;
    }
    get mp() {
        return this.#stats.mp;
    }
    set mp(value) {
        this.#stats.mp = value;
    }
    get gold() {
        return this.#stats.gold;
    }
    set gold(value) {
        this.#stats.gold = value;
    }
    get status() {
        return this.#stats;
        // return structuredClone(this.#stats);
    }
    get isAlive() {
        return this.#stats.hp > 0;
    }
}
