import { GhostField_Card } from "../card/index.js";
import type { GhostField_CardID } from "../card/type.js";
import type { GhostField_Custom, GhostField_InitialData_Card } from "../index.js";

export class GhostField_CardDeck<T extends GhostField_Custom = GhostField_Custom> {
    #cards: GhostField_Card<T>[];
    #drowCall: () => GhostField_CardID;

    #secureTable: Record<GhostField_CardID, number> = {};
    constructor(initData: GhostField_InitialData_Card<T>) {
        const cards = initData.data.filter(
            // 重複排除
            (data, index, array) => array.findIndex(i => i.id === data.id) === index
        ).map(data => new GhostField_Card<T>(data));

        this.#cards = cards;

        // 重みが0より大きいカードのみ
        // 存在するカードのみに絞る
        const tableData = Object.entries(initData.table).filter(([id, weight]) => weight > 0 && cards.some(card => card.id === id)) as [GhostField_CardID, number][];

        if (tableData.length === 0) throw new GhostField_Deck_InitError("テーブルに有効なデータが存在しません");

        this.#secureTable = Object.fromEntries(tableData);

        // 全体の重みを計算
        let total = 0;
        const tableCall = tableData.map(([id, weight]) => {
            const start = total;
            const end = total + weight;
            total = end;
            // 
            const call = (random: number) => (start <= random && random < end ? id : null);
            return call;
        });
        
        this.#drowCall = () => {
            const random = Math.floor(Math.random() * total);
            let drowId: GhostField_CardID | null = null;
            tableCall.some(call => {
                const card = call(random);
                if (card) {
                    drowId = card;
                    return true;
                }
                return false;
            });
            return drowId as unknown as GhostField_CardID;
        };
        
    }


    get allCards() {
        return [...this.#cards];
    }


    drow() {
        return this.#drowCall();
    }

    toJSON(): GhostField_InitialData_Card<T> {
        return {
            data: this.#cards.map(card => card.toJSON()),
            table: {...this.#secureTable}
        };
    }
}



export class GhostField_Deck_InitError extends Error {
    constructor(message?: string) {
        super(message ?? "デッキの初期化に失敗しました");
    }
}