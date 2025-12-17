import { GhostField_Card } from "../card/index.js";
import type { GhostField_CardID } from "../card/type.js";
import type { GhostField_Custom, GhostField_InitialData_Card } from "../index.js";
export declare class GhostField_CardDeck<T extends GhostField_Custom = GhostField_Custom> {
    #private;
    constructor(initData: GhostField_InitialData_Card<T>);
    get allCards(): GhostField_Card<T>[];
    drow(): GhostField_CardID;
    toJSON(): GhostField_InitialData_Card<T>;
}
export declare class GhostField_Deck_InitError extends Error {
    constructor(message?: string);
}
//# sourceMappingURL=main.d.ts.map