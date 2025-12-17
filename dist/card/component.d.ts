import type { Effect, GhostField_PlayerID } from "../index.js";
import type { Card_After_Variable_Insert, Game_Value } from "../index.js";
export type Card_CMP_Exchange = {};
export type Card_CMP_Buy = {};
export type Card_CMP_Sell = {};
export type Card_CMP_Attack = {
    multiUse: boolean;
    rate: number;
    value: Game_Value;
    afterAction?: Card_After_Action;
};
export type Card_CMP_Defense = {
    multiUse: boolean;
    value: Game_Value;
    afterAction?: Card_After_Action;
};
export type Card_CMP_Reflect = {
    rate: number;
    afterAction?: Card_After_Action;
};
export type Card_CMP_Magic_Reflect = {
    rate: number;
    afterAction?: Card_After_Action;
};
export type Card_CMP_Magic = {
    rate: number;
    value: Game_Value;
    afterAction?: Card_After_Action;
};
export type Card_CMP_Trap = {
    on_death?: {
        revive?: {
            rate: number;
            hp: number;
            mp: number;
            gold: number;
        };
        attack?: {
            rate: number;
            value: Card_After_Variable_Insert<number, true>;
            target: Card_After_Variable_Insert<GhostField_PlayerID | GhostField_PlayerID[]>;
        };
    };
};
export type Card_After_Action = {
    damage?: {
        rate: number;
        value: Card_After_Variable_Insert<number, true>;
        target: Card_After_Variable_Insert<GhostField_PlayerID>;
    };
    heal?: {
        rate: number;
        value: Card_After_Variable_Insert<number, true>;
        target: Card_After_Variable_Insert<GhostField_PlayerID>;
    };
    effect?: {
        rate: number;
        type: "add" | "remove";
        value: Card_After_Variable_Insert<Effect[], true>;
        target: Card_After_Variable_Insert<GhostField_PlayerID>;
    };
    ghost?: {};
};
//# sourceMappingURL=component.d.ts.map