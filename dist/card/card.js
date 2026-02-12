import { GF_CardError_NoDefensiveComponent, GF_CardError_NoOffensiveComponent } from "./error.js";
function genToValue(src) {
    return (gameValue) => {
        if (typeof gameValue === "number") {
            return gameValue;
        }
        else if (gameValue === undefined) {
            return 0;
        }
        else {
            return src[gameValue];
        }
    };
}
export class GF_Card {
    #component;
    constructor(component) {
        this.#component = component;
    }
    get component() {
        return this.#component;
    }
    get id() {
        return this.#component.id;
    }
    get element() {
        return this.#component.element;
    }
    get isMagic() {
        return this.#component.isMagic;
    }
    get isAttack() {
        return this.#component.offensive?.type === "attack";
    }
    /**
     * 使用オプションが利用可能かどうか
     */
    get canUseOptions() {
        const offensive = this.#component.offensive;
        return (offensive !== undefined && offensive.type === "exchange");
    }
    get cost() {
        return this.#component.cost;
    }
    get price() {
        return this.#component.price;
    }
    get name() {
        return this.#component.name;
    }
    get weight() {
        return this.#component.weight;
    }
    get offensiveComponent() {
        if (!this.#component.offensive)
            throw new GF_CardError_NoOffensiveComponent("攻撃コンポーネントが存在しません");
        return this.#component.offensive;
    }
    get defensiveComponent() {
        if (!this.#component.defensive)
            throw new GF_CardError_NoDefensiveComponent("防御コンポーネントが存在しません");
        return this.#component.defensive;
    }
    toString() {
        return JSON.stringify(this.#component);
    }
}
// export type GF_CardMixData_Draw<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
//     type: "draw";
// }
