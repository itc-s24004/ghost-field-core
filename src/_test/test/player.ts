import { GF_Player } from "../../player/player";
import { getInput, inputSelectIndex } from "../util";

export async function dev_player(player: GF_Player): Promise<void> {
    while (true) {
        console.log("現在のステータス:");
        console.log(`HP: ${player.hp}, MP: ${player.mp}, Gold: ${player.gold}`);
        const input = await inputSelectIndex("操作を選択してください。", [
            "終了",
            "HPを変更",
            "MPを変更",
            "Goldを変更"
        ]);
        switch (input) {
            case 0: {
                return;
            }
            case 1: {
                console.log("新しいHPを入力してください:");
                const hpInput = await getInput();
                const hp = parseInt(hpInput, 10);
                if (!isNaN(hp)) {
                    player.hp = hp;
                }
                break;
            }
            case 2: {
                console.log("新しいMPを入力してください:");
                const mpInput = await getInput();
                const mp = parseInt(mpInput, 10);
                if (!isNaN(mp)) {
                    player.mp = mp;
                }
                break;
            }
            case 3: {
                console.log("新しいGoldを入力してください:");
                const goldInput = await getInput();
                const gold = parseInt(goldInput, 10);
                if (!isNaN(gold)) {
                    player.gold = gold;
                }
                break;
            }
        }
    };
}