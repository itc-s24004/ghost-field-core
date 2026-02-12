import { GF_Element } from "../../card/element.js";
/**
 * 2つの属性を混ぜ合わせて新しい属性を生成します
 * @param e1
 * @param e2
 */
export function mixElement(e1, e2) {
    if (e1 === e2)
        return e1;
    switch (e1) {
        case GF_Element.Empty: return e2;
        case GF_Element.Normal: return GF_Element.Normal;
        case GF_Element.Fire: return (e2 === GF_Element.Wind) ? GF_Element.Lightning : GF_Element.Normal;
        case GF_Element.Wind: return (e2 === GF_Element.Fire) ? GF_Element.Lightning : GF_Element.Normal;
        case GF_Element.Water: return (e2 === GF_Element.Stone) ? GF_Element.Wood : GF_Element.Normal;
        case GF_Element.Stone: return (e2 === GF_Element.Water) ? GF_Element.Wood : GF_Element.Normal;
        case GF_Element.Lightning: return (e2 === GF_Element.Fire || e2 === GF_Element.Wind) ? GF_Element.Light : GF_Element.Normal;
        case GF_Element.Wood: return (e2 === GF_Element.Water || e2 === GF_Element.Stone) ? GF_Element.Wood : GF_Element.Normal;
        default: return GF_Element.Normal;
    }
}
/**
 * 属性に対して防御可能な属性の一覧を取得します
 * @param element
 * @returns
 *
 */
export function getElementWeakness(element) {
    switch (element) {
        case GF_Element.Normal: return Object.values(GF_Element);
        case GF_Element.Fire: return [GF_Element.Empty, GF_Element.Water];
        case GF_Element.Water: return [GF_Element.Empty, GF_Element.Fire];
        case GF_Element.Wind: return [GF_Element.Empty, GF_Element.Stone];
        case GF_Element.Stone: return [GF_Element.Empty, GF_Element.Wind];
        case GF_Element.Light: return [GF_Element.Empty, GF_Element.Light];
        case GF_Element.Dark: return Object.values(GF_Element);
        case GF_Element.Lightning: return [GF_Element.Empty, GF_Element.Stone, GF_Element.Wind, GF_Element.Lightning];
        case GF_Element.Wood: return [GF_Element.Empty, GF_Element.Fire, GF_Element.Water, GF_Element.Wood];
        case GF_Element.Empty: return [GF_Element.Empty];
    }
}
export function checkElementWeakness() { }
