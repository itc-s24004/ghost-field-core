import type { GF_EX_GameData } from "../game/action.js";
import type { GF_EffectType } from "../player/effect.js";
import type { GF_GameValue, GF_PlayerStatusType } from "../player/player.js";
import type { GF_Element } from "./element.js";

export type GF_Component = {
    type: string;
}

/**ブラックマーケットでの取引チケット */
export type GF_CC_Sell = GF_Component & {
    type: "sell";
}


/**等価交換 */
export type GF_CC_Exchange = GF_Component & {
    type: "exchange";
}


/**攻撃 */
export type GF_CC_Attack = GF_Component & {
    type: "attack";

    /**同時使用可能 */
    multiUse: boolean;

    /**攻撃力 */
    value: GF_GameValue;

    /**命中率 */
    rate: number;
}

/**防御 */
export type GF_CC_Defense = GF_Component & {
    type: "defense";

    /**同時使用可能 */
    multiUse: boolean;
    
    /**防御力 */
    value: GF_GameValue;
}

/**回復 */
export type GF_CC_Heal = GF_Component & {
    type: "heal";

    healType: GF_PlayerStatusType;

    /**回復量 */
    value: GF_GameValue;

    
    clearEffects?: GF_EffectType[];
}

/**復活 */
export type GF_CC_Revive = GF_Component & {
    type: "revive";

    /**復活後のHP */
    hp: GF_GameValue;
    /**復活後のMP */
    mp: GF_GameValue;
    /**復活後のゴールド */
    gold: GF_GameValue;
}






















export type GF_Card_ID = {brand: "Card_ID"} & string;
export type GF_CardComponent<E extends GF_EX_GameData = {}> = {

    id: GF_Card_ID;

    /**カード名 */
    name: string;

    /**価格 */
    price: number;

    /**属性 */
    element: GF_Element;

    /**魔法カード */
    isMagic: boolean;

    /**消費コスト */
    cost: GF_GameValue;

    /**攻撃コンポーネント */
    offensive?: GF_OffensiveComponent;

    /**防御コンポーネント */
    defensive?: GF_DefensiveComponent;

    /**罠コンポーネント */
    trap?: GF_TrapComponent;

    weight: number;
    
    /**拡張データ */
    exData?: E;
}


export type GF_OffensiveComponent = GF_CC_Sell | GF_CC_Exchange | GF_CC_Attack | GF_CC_Heal;

export type GF_DefensiveComponent = GF_CC_Defense;

export type GF_TrapComponent = GF_CC_Attack | GF_CC_Revive;