export declare enum GF_Element {
    Normal = "normal",
    Fire = "fire",
    Water = "water",
    Stone = "stone",
    Wind = "wind",
    Light = "light",
    Dark = "dark",
    Lightning = "lightning",
    Wood = "wood",
    /**
     * 以下の状態を示す特殊属性\
     * カードを使用しない\
     * ゴーストを持たない
     */
    Empty = "empty"
}
/**
 * 2つの属性を混ぜ合わせて新しい属性を生成します
 * @param e1
 * @param e2
 * @returns
 */
export declare function GF_ElementMixer(e1: GF_Element, e2: GF_Element): GF_Element;
/**
 * 2つ目の属性が1つ目の属性を守ることができるかどうかを判定します
 * @param attackElement
 * @param defenseElement
 * @returns
 */
export declare function GF_CheckElementDefense(attackElement: GF_Element, defenseElement: GF_Element): boolean;
