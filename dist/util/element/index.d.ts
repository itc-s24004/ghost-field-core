import { GF_Element } from "../../card/element.js";
/**
 * 2つの属性を混ぜ合わせて新しい属性を生成します
 * @param e1
 * @param e2
 */
export declare function mixElement(e1: GF_Element, e2: GF_Element): GF_Element;
/**
 * 属性に対して防御可能な属性の一覧を取得します
 * @param element
 * @returns
 *
 */
export declare function getElementWeakness(element: GF_Element): GF_Element[];
export declare function checkElementWeakness(): void;
