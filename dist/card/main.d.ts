import type { GhostField_Custom } from "../index.js";
import type { GhostField_CardComponent } from "./type.js";
export declare class GhostField_Card<T extends GhostField_Custom = GhostField_Custom> {
    #private;
    constructor(data: GhostField_CardComponent<T>);
    get id(): import("./type.js").GhostField_CardID;
    get name(): string;
    get description(): string;
    toJSON(): GhostField_CardComponent<T>;
}
//# sourceMappingURL=main.d.ts.map