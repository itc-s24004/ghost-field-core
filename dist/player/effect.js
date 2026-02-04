export var GF_EffectType;
(function (GF_EffectType) {
    /**再生 */
    GF_EffectType["regeneration"] = "regeneration";
    /**耐性 */
    GF_EffectType["resistance"] = "resistance";
    /**火傷 */
    GF_EffectType["burn"] = "burn";
    /**疫病 */
    GF_EffectType["epidemic"] = "epidemic";
    /**閃光 */
    GF_EffectType["flash"] = "flash";
    /**金縛り */
    GF_EffectType["paralysis"] = "paralysis";
})(GF_EffectType || (GF_EffectType = {}));
export class GF_EffectManager {
    constructor() { }
    #data = new Map();
    getEffectLevel(type) {
        return this.#data.get(type) ?? 0;
    }
    addEffect(type, level) {
        const currentLevel = this.getEffectLevel(type);
        const maxLevel = meta[type].maxLevel;
        const newLevel = Math.min(currentLevel + level, maxLevel);
        this.#data.set(type, newLevel);
    }
    clearEffect(type) {
        this.#data.delete(type);
    }
    hasEffect(type) {
        return this.#data.has(type);
    }
}
// デフォルトの効果メタデータ 拡張用
const meta = {
    [GF_EffectType.regeneration]: { maxLevel: 3 },
    [GF_EffectType.resistance]: { maxLevel: 1 },
    [GF_EffectType.burn]: { maxLevel: 3 },
    [GF_EffectType.epidemic]: { maxLevel: 3 },
    [GF_EffectType.flash]: { maxLevel: 1 },
    [GF_EffectType.paralysis]: { maxLevel: 1 }
};
