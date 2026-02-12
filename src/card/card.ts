import type { GF_EX_GameData } from "../game/action.js";
import type { GF_GameValue, GF_Player, GF_PlayerStatusType } from "../player/player.js";
import type { GF_Card_ID, GF_CardComponent, GF_OffensiveComponent } from "./component.js";
import { GF_Element, GF_ElementMixer } from "./element.js";
import { GF_CardError_ComponentConflict, GF_CardError_MultiUseRequired, GF_CardError_NoDefensiveComponent, GF_CardError_NoOffensiveComponent } from "./error.js";







function genToValue(src: GF_Player) {
    return (gameValue: GF_GameValue | undefined): number => {
        if (typeof gameValue === "number") {
            return gameValue;

        } else if (gameValue === undefined) {
            return 0;

        } else {
            return src[gameValue];

        }
    };
}


export class GF_Card<EX_Card extends GF_EX_GameData = {}> {
    
    #component: GF_CardComponent<EX_Card>;
    constructor(component: GF_CardComponent<EX_Card>) {
        this.#component = component;
    }

    get component(): GF_CardComponent<EX_Card> {
        return this.#component;
    }

    get id(): GF_Card_ID {
        return this.#component.id;
    }

    get element(): GF_Element {
        return this.#component.element;
    }

    get isMagic(): boolean {
        return this.#component.isMagic;
    }

    get isAttack(): boolean {
        return this.#component.offensive?.type === "attack";
    }

    /**
     * 使用オプションが利用可能かどうか
     */
    get canUseOptions(): boolean {
        const offensive = this.#component.offensive;
        return (offensive !== undefined && offensive.type === "exchange");
    }

    get cost() {
        return this.#component.cost;
    }

    get price() {
        return this.#component.price;
    }

    get name(): string {
        return this.#component.name;
    }

    get weight(): number {
        return this.#component.weight;
    }


    get offensiveComponent(): GF_OffensiveComponent {
        if (!this.#component.offensive) throw new GF_CardError_NoOffensiveComponent("攻撃コンポーネントが存在しません");
        return this.#component.offensive;
    }


    get defensiveComponent() {
        if (!this.#component.defensive) throw new GF_CardError_NoDefensiveComponent("防御コンポーネントが存在しません");
        return this.#component.defensive;
    }





    toString(): string {
        return JSON.stringify(this.#component);
    }
}



// export type GF_CardMixData_Draw<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
//     type: "draw";
// }