import { GF_Deck } from "../deck/deck.js";
import { GameInitData } from "../game.init.data.js";
import { GF_Player } from "../player/player.js";
import { dev_deck } from "./test/deck.js";
import { dev_game } from "./test/game.js";
import { dev_ex_mix } from "./test/mix.js";
import { dev_Player_deck } from "./test/player_deck.js";
import { inputSelectIndex } from "./util.js";
(async () => {
    while (true) {
        console.log("=== メニュー ===");
        const input = await inputSelectIndex("操作を選択してください。", [
            "終了",
            "デッキテスト",
            "カード合成テスト",
            "プレイヤーデッキテスト",
            "ゲームテスト"
        ]);
        if (input === 0) {
            console.log("テストを終了します。");
            process.exit(0);
        }
        else if (input === 1) {
            await dev_deck();
        }
        else if (input === 2) {
            const deck = new GF_Deck(GameInitData.cards);
            const player = new GF_Player(deck);
            await dev_ex_mix(player, deck.allCards);
        }
        else if (input === 3) {
            const deck = new GF_Deck(GameInitData.cards);
            const player = new GF_Player(deck);
            await dev_Player_deck(player);
        }
        else if (input === 4) {
            await dev_game();
        }
    }
})();
