import type { GF_EX_GameData } from "../game/action.js";
import type { GF_GameValue } from "../player/player.js";
import type { GF_Card_ID, GF_CardComponent, GF_OffensiveComponent } from "./component.js";
import { GF_Element } from "./element.js";
export declare class GF_Card<EX_Card extends GF_EX_GameData = {}> {
    #private;
    constructor(component: GF_CardComponent<EX_Card>);
    get component(): GF_CardComponent<EX_Card>;
    get id(): GF_Card_ID;
    get element(): GF_Element;
    get isMagic(): boolean;
    get isAttack(): boolean;
    /**
     * 使用オプションが利用可能かどうか
     */
    get canUseOptions(): boolean;
    get cost(): GF_GameValue;
    get price(): number;
    get name(): string;
    get weight(): number;
    get offensiveComponent(): GF_OffensiveComponent;
    get defensiveComponent(): import("./component.js").GF_CC_Defense;
    toString(): string;
}
