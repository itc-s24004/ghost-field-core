import { GameInitData } from "../../game.init.data";
import { GF_Game } from "../../game/game";
import { inputInt, inputSelectIndex, inputSelectOptions, selectCardMap } from "../util";
export async function dev_game() {
    const game = new GF_Game(GameInitData, {
        "secureMode": false,
        events: {
            onDrawCard(ev) {
                console.log(`${game.getPlayerIndex(ev.player)}はカードをドローした`);
                console.log(`引いたカード: ${ev.drawnCard.toString()}`);
                if (ev.removedCard)
                    console.log(`捨てたカード: ${ev.removedCard.toString()}`);
            },
            onUseCard(ev) {
                const { type, player, cards, result } = ev;
                if (ev.type === "offensive") {
                    console.log(`${game.getPlayerIndex(ev.player)}は${game.getPlayerIndex(ev.target)}に攻撃カードを使用した！`);
                    ev.cards.forEach((card) => {
                        console.log(`使用カード: ${card.toString()}`);
                    });
                }
                else {
                    console.log(`${game.getPlayerIndex(ev.player)}は防御カードを使用した！`);
                    ev.cards.forEach((card) => {
                        console.log(`使用カード: ${card.toString()}`);
                    });
                }
            },
            onAttack(ev) {
                const action = ev.action;
                console.log(`${game.getPlayerIndex(action.src)}が${game.getPlayerIndex(action.target)}に攻撃を仕掛けた！`);
                if (action.isMiss)
                    console.log(`${game.getPlayerIndex(action.src)}の攻撃は${game.getPlayerIndex(action.target)}に命中しなかった！`);
            },
            onExchange(ev) {
                const { player, action } = ev;
                console.log(`${game.getPlayerIndex(player)}は両替を行った！`);
                console.log(`HP: ${action.hp}, MP: ${action.mp}, Gold: ${action.gold}`);
            },
            onHeal(ev) {
                const { player, action: { healType, value } } = ev;
                console.log(`${game.getPlayerIndex(ev.player)}は${healType}を${value}回復した！`);
            },
            onDefense(ev) {
                console.log(`${game.getPlayerIndex(ev.player)}は${game.getPlayerIndex(ev.damageSource)}の攻撃を防御した！`);
            },
            onDamage(ev) {
                console.log(`${game.getPlayerIndex(ev.player)}は${game.getPlayerIndex(ev.damageSource)}から${ev.damage}のダメージを受けた！`);
            },
            onDeath(ev) {
                console.log(`${game.getPlayerIndex(ev.player)}は死亡した！`);
            },
            onGameEnd(ev) {
                const { winner } = ev;
                if (winner) {
                    console.log(`ゲーム終了！勝者は${game.getPlayerIndex(ev.winner)}です。`);
                }
                else {
                    console.log("ゲーム終了！引き分けです。");
                }
            }
        }
    });
    const playerCount = await inputInt("プレイヤー数を入力してください (正の整数)");
    game.reset(playerCount);
    while (true) {
        if (game.winner)
            break;
        if (game.currentAction) {
            console.log("防御フェーズ");
            const selectedCards = await selectCardMap(game.currentPlayer.deck.hand, game.currentPlayer.deck.magicStack);
            const baseCard = selectedCards[0];
            game.next(selectedCards, game.currentPlayerIndex, baseCard?.canUseOptions ? await inputSelectOptions(game.currentPlayer) : {});
        }
        else {
            console.log("攻撃フェーズ");
            const player = game.currentPlayer;
            const selectedCards = await selectCardMap(player.deck.hand, player.deck.magicStack);
            const baseCard = selectedCards[0];
            const index = baseCard ? await inputSelectIndex("使用対象を選択してください", new Array(game.playerCount).fill(0).map((_, i) => i === game.currentPlayerIndex ? `${i} (自分)` : `${i}`)) : game.currentPlayerIndex;
            game.next(selectedCards, index, baseCard?.canUseOptions ? await inputSelectOptions(player) : {});
        }
    }
}
