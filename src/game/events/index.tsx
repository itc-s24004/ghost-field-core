import type { GF_Card } from "../../card/card.js";
import type { GF_UseCardResult } from "../../deck/deck.js";
import type { GF_Player } from "../../player/player.js";
import type { GF_CardMixData_Exchange, GF_CardMixData_Heal } from "../../util/card/index.js";
import type { GF_EX_GameData, GF_SystemAction, GF_SystemAction_Offensive } from "../action.js";

export type GF_SystemEventDataMap<EX_Card extends GF_EX_GameData = {}> = {
    /**カードを引いた時 */
    onDrawCard: {
        player: GF_Player<EX_Card>;
        drawnCard: GF_Card<EX_Card>;
        removedCard: GF_Card<EX_Card> | undefined;
    }
    /**カード使用時 */
    onUseCard: {
        type: "offensive";
        player: GF_Player<EX_Card>;
        target: GF_Player<EX_Card>;
        cards: GF_Card<EX_Card>[];
        result: GF_UseCardResult<EX_Card>;
        
    } | {
        type: "defensive";
        player: GF_Player<EX_Card>;
        cards: GF_Card<EX_Card>[];
        result: GF_UseCardResult<EX_Card>;
    }
    /**魔法カードが追加されたとき */
    onAddMagicCard: {
        player: GF_Player<EX_Card>;
        card: GF_Card<EX_Card>;
    }
    /**攻撃を行った時 */
    onAttack: {
        action: GF_SystemAction<EX_Card>;
    }
    /**両替を行った時 */
    onExchange: {
        player: GF_Player<EX_Card>;
        action: GF_CardMixData_Exchange<EX_Card>;
    }
    /**回復を行った時 */
    onHeal: {
        player: GF_Player<EX_Card>;
        action: GF_CardMixData_Heal<EX_Card>;
    }
    /**ダメージを受けた時 */
    onDamage: {
        player: GF_Player<EX_Card>;
        damageSource: GF_Player<EX_Card>;
        damage: number;
        nextAction: {
            /**ゴーストが祓われるかの抽選を行うかどうか */
            ghost: boolean;
            /**トラップの発動を行うかどうか */
            trap: boolean;
        }
    }
    /**防御行動時 */
    onDefense: {
        player: GF_Player<EX_Card>;
        damageSource: GF_Player<EX_Card>;
    }
    /**ゴーストが付与された時 */
    onAddGhost: {
        player: GF_Player<EX_Card>;
    }
    /**ゴーストが祓われた時 */
    onRemoveGhost: {
        player: GF_Player<EX_Card>;
    }
    /**ゴーストの行動時 */
    onGhostAction: {
        player: GF_Player<EX_Card>;
        damageSource: GF_Player<EX_Card>;
        action: GF_SystemAction_Offensive<EX_Card>;
    }
    /**トラップ発動時 */
    onTrapAction: {
        player: GF_Player<EX_Card>;
        damageSource: GF_Player<EX_Card>;
        action: GF_SystemAction_Offensive<EX_Card>;
    }
    /**プレイヤーの死亡時 */
    onDeath: {
        player: GF_Player<EX_Card>;
    }
    /**ゲーム終了時 */
    onGameEnd: {
        winner: GF_Player<EX_Card> | undefined;
    }

    onNextTurn: {
        player: GF_Player<EX_Card>;
    }
}

export type GF_GameEventMap<EX_Card extends GF_EX_GameData = {}> = {
    [K in keyof GF_SystemEventDataMap<EX_Card>]?: (ev: GF_SystemEventDataMap<EX_Card>[K]) => void;
}