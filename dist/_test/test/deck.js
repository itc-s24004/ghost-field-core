import { GF_Deck } from "../../deck/deck";
import { GameInitData } from "../../game.init.data";
import { getInput, inputInt } from "../util";
export async function dev_deck() {
    const deck = new GF_Deck(GameInitData.cards);
    const cards = [];
    const drawCount = await inputInt("カードを引く回数を入力してください (正の整数 または 0 = 無限)");
    if (!isNaN(drawCount) && drawCount > 0) {
        for (let i = 0; i < drawCount; i++) {
            const card = deck.drawCard();
            console.log(card.toString());
            cards.push(card);
        }
    }
    else {
        console.log("無限にカードを引くモードです。Enterキーを押してカードを1枚引きます。exitと入力すると終了します。");
        while (true) {
            const input = await getInput();
            if (input === "exit") {
                console.log("デッキテストを終了します。");
                break;
            }
            else if (input !== "") {
                console.log("exitと入力するとデッキテストを終了します。");
                continue;
            }
            const card = deck.drawCard();
            console.log(card.toString());
            cards.push(card);
        }
    }
    console.log("=== カード出現率 ===");
    const cardCounts = new Map();
    cards.forEach(card => {
        const count = cardCounts.get(card) ?? 0;
        cardCounts.set(card, count + 1);
    });
    const max = Math.max(...Array.from(cardCounts.values()));
    cardCounts.forEach((count, card) => {
        console.log(`${(count / cards.length * 100).toFixed(4).toString().padStart(7, " ")}% | ${count.toString().padStart(max.toString().length, " ")}枚 | ${card.name}`);
    });
    console.log("デッキテストを終了します。");
    await getInput("Enterキーを押して続行: ");
}
