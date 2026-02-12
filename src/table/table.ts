import { GF_Error_Undefined } from "../game/error.js";

export function generateTable<value, tableData extends Map<value, number> = Map<value, number>>(tableData: tableData): () => value {
    let total = 0;
    const tableMap: Map<number, value> = new Map(tableData.entries().map(([key, value]) => {
        total += value;
        return [total, key];
    }));

    return () => {
        const rand = Math.random() * total;
        for (const [threshold, value] of tableMap.entries()) {
            if (rand < threshold) {
                return value;
            }
        }
        // カードが指定されていればここには到達しない
        throw new GF_Error_Undefined("値が見つかりませんでした");
    }
}

