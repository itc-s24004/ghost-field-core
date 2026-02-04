export var GF_Element;
(function (GF_Element) {
    GF_Element["Normal"] = "normal";
    GF_Element["Fire"] = "fire";
    GF_Element["Water"] = "water";
    GF_Element["Stone"] = "stone";
    GF_Element["Wind"] = "wind";
    GF_Element["Light"] = "light";
    GF_Element["Dark"] = "dark";
    GF_Element["Lightning"] = "lightning";
    GF_Element["Wood"] = "wood";
    /**
     * 以下の状態を示す特殊属性\
     * カードを使用しない\
     * ゴーストを持たない
     */
    GF_Element["Empty"] = "empty";
})(GF_Element || (GF_Element = {}));
/**
 * 2つの属性を混ぜ合わせて新しい属性を生成します
 * @param e1
 * @param e2
 * @returns
 */
export function GF_ElementMixer(e1, e2) {
    if (e1 === GF_Element.Empty)
        return e2;
    if (e2 === GF_Element.Empty)
        return e1;
    if (e1 === GF_Element.Normal || e2 === GF_Element.Normal)
        return GF_Element.Normal;
    if (e1 === e2)
        return e1;
    switch (e1) {
        // 火・風以外の組み合わせは無属性
        case GF_Element.Lightning: {
            return (e2 === GF_Element.Fire || e2 === GF_Element.Wind) ? GF_Element.Light : GF_Element.Normal;
        }
        // 水・石以外の組み合わせは無属性
        case GF_Element.Wood: {
            return (e2 === GF_Element.Water || e2 === GF_Element.Stone) ? GF_Element.Wood : GF_Element.Normal;
        }
        // 火+風=雷、それ以外は無属性
        case GF_Element.Fire: {
            return (e2 === GF_Element.Wind) ? GF_Element.Lightning : GF_Element.Normal;
        }
        // 風+火=雷、それ以外は無属性
        case GF_Element.Wind: {
            return (e2 === GF_Element.Fire) ? GF_Element.Lightning : GF_Element.Normal;
        }
        // 水+石=木、それ以外は無属性
        case GF_Element.Water: {
            return (e2 === GF_Element.Stone) ? GF_Element.Wood : GF_Element.Normal;
        }
        // 石+水=木、それ以外は無属性
        case GF_Element.Stone: {
            return (e2 === GF_Element.Water) ? GF_Element.Wood : GF_Element.Normal;
        }
        default: {
            return GF_Element.Normal;
        }
    }
}
/**
 * 2つ目の属性が1つ目の属性を守ることができるかどうかを判定します
 * @param attackElement
 * @param defenseElement
 * @returns
 */
export function GF_CheckElementDefense(attackElement, defenseElement) {
    //同属性の場合は防御可能
    if (attackElement === defenseElement)
        return true;
    switch (attackElement) {
        case GF_Element.Empty:
        case GF_Element.Normal:
        case GF_Element.Dark: return true;
        //火 水
        case GF_Element.Fire: return defenseElement === GF_Element.Water;
        case GF_Element.Water: return defenseElement === GF_Element.Fire;
        //風 石
        case GF_Element.Stone: return defenseElement === GF_Element.Wind;
        case GF_Element.Wind: return defenseElement === GF_Element.Stone;
        //光
        case GF_Element.Light: return defenseElement === GF_Element.Light;
        //雷 木
        case GF_Element.Lightning: return defenseElement === GF_Element.Water || defenseElement === GF_Element.Stone;
        case GF_Element.Wood: return defenseElement === GF_Element.Fire || defenseElement === GF_Element.Wind;
        default: return false;
    }
}
