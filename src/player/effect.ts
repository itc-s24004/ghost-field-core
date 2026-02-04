export enum GF_EffectType {
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
    paralysis = "paralysis",
}



export type GF_Effect_Data = {
    /**効果タイプ */
    type: GF_EffectType;

    /**効果レベル */
    level: number;
}


export type GF_EffectMeta = {
    maxLevel: number;
}

export type GF_EffectMetaData = Record<GF_EffectType, GF_EffectMeta> 


export class GF_EffectManager {
    constructor() {}

    #data: Map<GF_EffectType, number> = new Map();

    getEffectLevel(type: GF_EffectType): number {
        return this.#data.get(type) ?? 0;
    }

    addEffect(type: GF_EffectType, level: number): void {
        const currentLevel = this.getEffectLevel(type);
        const maxLevel = meta[type].maxLevel;
        const newLevel = Math.min(currentLevel + level, maxLevel);
        this.#data.set(type, newLevel);
    }

    clearEffect(type: GF_EffectType): void {
        this.#data.delete(type);
    }

    hasEffect(type: GF_EffectType): boolean {
        return this.#data.has(type);
    }
}


// デフォルトの効果メタデータ 拡張用
const meta: GF_EffectMetaData = {
    [GF_EffectType.regeneration]: { maxLevel: 3 },
    [GF_EffectType.resistance]: { maxLevel: 1 },
    [GF_EffectType.burn]: { maxLevel: 3 },
    [GF_EffectType.epidemic]: { maxLevel: 3 },
    [GF_EffectType.flash]: { maxLevel: 1 },
    [GF_EffectType.paralysis]: { maxLevel: 1 }
}