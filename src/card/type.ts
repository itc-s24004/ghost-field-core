import type { GhostField_Custom, GhostField_Element } from "../index.js";
import type { Card_CMP_Attack, Card_CMP_Buy, Card_CMP_Defense, Card_CMP_Exchange, Card_CMP_Magic, Card_CMP_Magic_Reflect, Card_CMP_Reflect, Card_CMP_Sell, Card_CMP_Trap } from "./component.js";

export type GhostField_CardID = string & {brand: "GhostField_CardID"};
export type GhostField_CardComponent<Custom extends GhostField_Custom = {}> = {
    /**フォーマットバージョン */
    format: number;
    
    /**カードID */
    id: GhostField_CardID;

    /**カード名 */
    name: string;
    /**カードの説明文 */
    description: string;
    /**カードの価格 */
    price: number;
    /**カードの属性 */
    element: GhostField_Element;
    /**捨てることができるか */
    canDrop: boolean;
    /**カードのタグ */
    tags: string[];


    /**両替 */
    exchange?: Card_CMP_Exchange;
    /**購入 */
    buy?: Card_CMP_Buy;
    /**販売 */
    sell?: Card_CMP_Sell;


    /**攻撃 */
    attack?: Card_CMP_Attack;
    /**防御 */
    defense?: Card_CMP_Defense;
    /**反射 */
    reflect?: Card_CMP_Reflect;
    /**魔法反射 */
    magic_reflect?: Card_CMP_Magic_Reflect;
    /**魔法 */
    magic?: Card_CMP_Magic;
    /**トラップ */
    trap?: Card_CMP_Trap;


    custom: Custom;
}


