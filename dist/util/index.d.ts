import { cardArray_to_cardIDMap, cardArray_to_cardMap, useDefensive, useOffensive } from "./card/index.js";
import { getElementWeakness, mixElement } from "./element/index.js";
export declare class GF_Util {
    static deepFreeze<T>(obj: T): Readonly<T>;
    /**2つの属性を混ぜ合わせて新しい属性を生成します */
    static mixElement: typeof mixElement;
    /**属性に対する防御可能な属性の一覧を取得します */
    static getElementWeakness: typeof getElementWeakness;
    /**複数のカードを合成して攻撃データを生成します */
    static useOffensive: typeof useOffensive;
    /**複数のカードを合成して防御データを生成します */
    static useDefensive: typeof useDefensive;
    /**カードの配列をカードIDと枚数のマップに変換します */
    static cardArray_to_cardIDMap: typeof cardArray_to_cardIDMap;
    /**カードの配列をカードと枚数のマップに変換します */
    static cardArray_to_cardMap: typeof cardArray_to_cardMap;
}
export type * from "./card/index.js";
