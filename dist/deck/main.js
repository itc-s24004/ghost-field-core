import { GhostField_Card } from "../card/index.js";
export class GhostField_CardDeck {
    #cards;
    #drowCall;
    #secureTable = {};
    constructor(initData) {
        const cards = initData.data.filter(
        // 重複排除
        (data, index, array) => array.findIndex(i => i.id === data.id) === index).map(data => new GhostField_Card(data));
        this.#cards = cards;
        // 重みが0より大きいカードのみ
        // 存在するカードのみに絞る
        const tableData = Object.entries(initData.table).filter(([id, weight]) => weight > 0 && cards.some(card => card.id === id));
        if (tableData.length === 0)
            throw new GhostField_Deck_InitError("テーブルに有効なデータが存在しません");
        this.#secureTable = Object.fromEntries(tableData);
        // 全体の重みを計算
        let total = 0;
        const tableCall = tableData.map(([id, weight]) => {
            const start = total;
            const end = total + weight;
            total = end;
            // 
            const call = (random) => (start <= random && random < end ? id : null);
            return call;
        });
        this.#drowCall = () => {
            const random = Math.floor(Math.random() * total);
            let drowId = null;
            tableCall.some(call => {
                const card = call(random);
                if (card) {
                    drowId = card;
                    return true;
                }
                return false;
            });
            return drowId;
        };
    }
    get allCards() {
        return [...this.#cards];
    }
    drow() {
        return this.#drowCall();
    }
    toJSON() {
        return {
            data: this.#cards.map(card => card.toJSON()),
            table: { ...this.#secureTable }
        };
    }
}
export class GhostField_Deck_InitError extends Error {
    constructor(message) {
        super(message ?? "デッキの初期化に失敗しました");
    }
}
//# sourceMappingURL=main.js.map