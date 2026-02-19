import { GF_Element } from "../card/element.js";
import { cardArray_to_cardIDMap, cardArray_to_cardMap, useDefensive, useOffensive } from "./card/index.js";
import { getElementWeakness, mixElement } from "./element/index.js";

export class GF_Util {
    static deepFreeze<T>(obj: T): Readonly<T> {

        Object.getOwnPropertyNames(obj).forEach((prop) => {
            const value = (obj as any)[prop];
            if (
                value &&
                (typeof value === "object" || typeof value === "function") &&
                !Object.isFrozen(value)
            ) {
                GF_Util.deepFreeze(value);
            }
        });

        return Object.freeze(obj);
    }


    /**2つの属性を混ぜ合わせて新しい属性を生成します */
    static mixElement = mixElement;
    /**属性に対する防御可能な属性の一覧を取得します */
    static getElementWeakness = getElementWeakness;


    /**複数のカードを合成して攻撃データを生成します */
    static useOffensive = useOffensive;
    /**複数のカードを合成して防御データを生成します */
    static useDefensive = useDefensive;


    /**カードの配列をカードIDと枚数のマップに変換します */
    static cardArray_to_cardIDMap = cardArray_to_cardIDMap;
    /**カードの配列をカードと枚数のマップに変換します */
    static cardArray_to_cardMap = cardArray_to_cardMap;
}


export type * from "./card/index.js";