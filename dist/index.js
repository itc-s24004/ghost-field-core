import { GhostField_CardDeck } from "./deck/index.js";
export var GhostField_Element;
(function (GhostField_Element) {
    GhostField_Element["Normal"] = "normal";
    GhostField_Element["Fire"] = "fire";
    GhostField_Element["Water"] = "water";
    GhostField_Element["Wood"] = "wood";
    GhostField_Element["Stone"] = "stone";
    GhostField_Element["Light"] = "light";
    GhostField_Element["Dark"] = "dark";
})(GhostField_Element || (GhostField_Element = {}));
export var Effect;
(function (Effect) {
    Effect["Cold"] = "cold";
    Effect["Fever"] = "fever";
    Effect["Hell"] = "hell";
    Effect["Heven"] = "heaven";
    Effect["Fog"] = "fog";
    Effect["Flash"] = "flash";
    Effect["Dream"] = "dream";
    Effect["Dark"] = "dark";
})(Effect || (Effect = {}));
export class GhostField {
    get initData() {
        return this.#deck.allCards;
    }
    #deck;
    constructor(data) {
        this.#deck = new GhostField_CardDeck(data.card);
    }
    start(player) {
    }
    on() {
    }
    close() {
    }
    playerAction() {
    }
    toJSON() {
        return {
            card: this.#deck.toJSON(),
            ghost: {}
        };
    }
}
export * from "./card/index.js";
export * from "./deck/index.js";
export * from "./player/index.js";
//# sourceMappingURL=index.js.map