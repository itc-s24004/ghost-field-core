import { GF_Card } from "../../card/card";
import type { GF_Player } from "../../player/player";
import { getInput, inputSelectIndex, selectCards, toCardsString } from "../util";
import { dev_player } from "./player";

export async function dev_Player_deck(player: GF_Player) {
    while (true) {
        const input = await inputSelectIndex("操作を選択してください。", [
            "状態を表示する",
            "カードをドローする",
            "カードを使用する",
            "ステータスを変更",
            "終了する"
        ]);
        if (input === 0) {
            console.log("プレイヤーステータス:");
            console.log(`HP: ${player.hp}, MP: ${player.mp}, Gold: ${player.gold}`);
            console.log("手札:");
            console.log(toCardsString(player.deck.hand.keys().toArray(), true));
            console.log("魔法スタック:");
            console.log(toCardsString(player.deck.magicStack.keys().toArray(), true));
            await getInput("Enterキーを押して続行: ");


        } else if (input === 1) {
            const result = player.deck.drawCard();
            console.log("引いたカード:");
            console.log(result.drawnCard.toString());
            console.log("捨てたカード:");
            console.log(result.removedCard ? result.removedCard.toString() : "なし");
            await getInput("Enterキーを押して続行: ");


        } else if (input === 2) {
            console.log("カード使用テストを開始します。");
            const selectedCards = await selectCards([
                ...player.deck.hand.keys().toArray(),
                ...player.deck.magicStack.keys().toArray()
            ]);
            const baseCard = selectedCards[0];
            if (!baseCard) {
                console.log("カードが選択されていません。");
                continue;
            }
            const multiCards = selectedCards.slice(1);

            const useType = await inputSelectIndex("使用タイプを選択してください。", [
                "攻撃カードとして使用する",
                "防御カードとして使用する"
            ]);
            if (useType === 0) {
                console.log("攻撃カードとして使用します。");
                const mixData = GF_Card.useOffensive(player, baseCard, { cards: multiCards });
                const result = player.deck.useCard(mixData)
                console.log("使用結果:");
                console.log(result);

            } else {
                console.log("防御カードとして使用します。");
                const mixData = GF_Card.useDefensive(player, baseCard, { cards: multiCards });
                const result = player.deck.useCard(mixData)
                console.log("使用結果:");
                console.log(result);
            }
            await getInput("Enterキーを押して続行: ");

        } else if (input === 3) {
            await dev_player(player);

        } else if (input === 4) {
            console.log("プレイヤーデッキテストを終了します。");
            await getInput("Enterキーを押して続行: ");
            break;
        }
    }

}