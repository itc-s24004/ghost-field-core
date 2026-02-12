import { GF_Card } from "../../card/card.js";
import type { GF_Player } from "../../player/player.js";
import { GF_Util } from "../../util/index.js";
import { getInput, inputSelectIndex, selectCards, toCardsString } from "../util.js";
import { dev_player } from "./player.js";


export async function dev_ex_mix(player: GF_Player, cards: GF_Card[]) {
    console.log(cards);
    const selectedCards: GF_Card[] = [];
    
    while (true) {
        console.log("現在の選択カード:");
        console.log(toCardsString(selectedCards, false));
        const input = await inputSelectIndex("操作を選択してください。", [
            "終了する",
            "カードを選択する",
            "選択をクリアする",
            "攻撃カードとして合成する",
            "防御カードとして合成する",
            "プレイヤーステータスを変更する"
        ]);

        switch (input) {
            case 0: {
                console.log("混成テストを終了します。");
                return;
            }
            case 1: {
                const selected = await selectCards(cards);
                selectedCards.push(...selected);
                break;
            }
            case 2: {
                selectedCards.length = 0;
                console.log("選択がクリアされました。");
                break;
            }
            case 3: {
                if (selectedCards.length < 1) {
                    console.log("1枚以上のカードが必要です。");
                    continue;
                }
                console.log("攻撃として混成を実行します。選択されたカード:");
                console.log(toCardsString(selectedCards, false));
                // ここで混成ロジックを呼び出すなどの処理を行う
                const mixData = GF_Util.useOffensive(player, selectedCards[0] as GF_Card, { cards: selectedCards.slice(1) });
                console.log("混成結果:");
                console.log(mixData);
                console.log("Enterキーを押して続行します。");
                await getInput();
                break;
            }
            case 4: {
                console.log("防御として混成を実行します。選択されたカード:");
                console.log(toCardsString(selectedCards, false));
                // ここで混成ロジックを呼び出すなどの処理を行う
                const mixData = GF_Util.useDefensive(player, selectedCards[0], { cards: selectedCards.slice(1) });
                console.log("混成結果:");
                console.log(mixData);
                console.log("Enterキーを押して続行します。");
                await getInput();
                break;
            }
            case 5: {
                await dev_player(player);
                break;
            }
        }
    }
}