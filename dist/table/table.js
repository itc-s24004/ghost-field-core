import { GF_Error_Undefined } from "../game/error";
export function generateTable(tableData) {
    let total = 0;
    const tableMap = new Map(tableData.entries().map(([key, value]) => {
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
    };
}
