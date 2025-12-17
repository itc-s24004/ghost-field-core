export class GhostField_Card {
    #rawData;
    constructor(data) {
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
//# sourceMappingURL=main.js.map