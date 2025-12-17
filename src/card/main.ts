import type { GhostField_Custom } from "../index.js";
import type { GhostField_CardComponent } from "./type.js";

export class GhostField_Card<T extends GhostField_Custom = GhostField_Custom> {
    #rawData: GhostField_CardComponent<T>;
    constructor(data: GhostField_CardComponent<T>) {
        this.#rawData = data;
    }


    get id() {
        return this.#rawData.id;
    }

    get name() {
        return this.#rawData.name;
    }

    get description() {
        return this.#rawData.description;
    }


    toJSON() {
        return structuredClone(this.#rawData);
    }
}