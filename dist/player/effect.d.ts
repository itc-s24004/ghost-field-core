export declare enum GF_EffectType {
    /**再生 */
    regeneration = "regeneration",
    /**耐性 */
    resistance = "resistance",
    /**火傷 */
    burn = "burn",
    /**疫病 */
    epidemic = "epidemic",
    /**閃光 */
    flash = "flash",
    /**金縛り */
    paralysis = "paralysis"
}
export type GF_Effect_Data = {
    /**効果タイプ */
    type: GF_EffectType;
    /**効果レベル */
    level: number;
};
export type GF_EffectMeta = {
    maxLevel: number;
};
export type GF_EffectMetaData = Record<GF_EffectType, GF_EffectMeta>;
export declare class GF_EffectManager {
    #private;
    constructor();
    getEffectLevel(type: GF_EffectType): number;
    addEffect(type: GF_EffectType, level: number): void;
    clearEffect(type: GF_EffectType): void;
    hasEffect(type: GF_EffectType): boolean;
}
