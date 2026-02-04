export async function getInput(label) {
    if (label) {
        process.stdout.write(label);
    }
    return new Promise((resolve) => {
        process.stdin.once("data", (data) => {
            resolve(data.toString().trim());
        });
    });
}
export async function inputBoolean(label) {
    process.stdout.write(`${label} (y/n): `);
    const input = await getInput();
    return input.toLowerCase() === "y";
}
export async function inputNumber(label) {
    process.stdout.write(`${label}: `);
    const input = await getInput();
    return parseFloat(input);
}
export async function inputInt(label) {
    process.stdout.write(`${label}: `);
    const input = await getInput();
    return parseInt(input, 10);
}
export async function inputSelectIndex(label, options) {
    console.log(label);
    options.forEach((option, index) => {
        console.log(`${index}: ${option}`);
    });
    const index = await inputInt("番号を入力してください");
    if (isNaN(index) || index < 0 || index >= options.length) {
        console.log("無効な入力です。");
        await getInput("Enterキーを押して再開: ");
        return await inputSelectIndex(label, options);
    }
    return index;
}
export async function selectCardMap(hand, magicStack) {
    const cards = new Map([...hand, ...magicStack]);
    console.log("選択可能なカード:");
    console.log(toCardMapString(cards, true));
    console.log("選択するカードの番号をカンマ区切りで入力してください。");
    const input = await getInput();
    const indices = input.split(",").map((s) => parseInt(s.trim(), 10));
    const cardsArray = Array.from(cards.keys());
    return indices.map((i) => cardsArray[i]).filter((c) => c !== undefined);
}
export async function selectCards(cards) {
    console.log("選択可能なカード:");
    console.log(toCardsString(cards, true));
    console.log("選択するカードの番号をカンマ区切りで入力してください。");
    const input = await getInput();
    const indices = input.split(",").map((s) => parseInt(s.trim(), 10));
    return indices.map((i) => cards[i]).filter((c) => c !== undefined);
}
export function toCardsString(cards, showIndex) {
    return cards.map((c, i) => showIndex ? `${i}: ${c.toString()}` : c.toString()).join("\n");
}
export function toCardMapString(cardMap, showIndex = false) {
    return cardMap.entries().map(([card, count], index) => `${showIndex ? `${index}: ` : " "}${count}x ${card.toString()}`).toArray().join("\n");
}
export async function useCards(player) {
    const deck = player.deck;
    const { hand, magicStack } = deck;
    const allCards = [...hand.keys(), ...magicStack.keys()];
    let index = 0;
    console.log("手札:");
    hand.forEach((count, card) => {
        console.log(`${index}: ${count}x ${card.toString()}`);
        index++;
    });
    console.log("魔法スタック:");
    magicStack.forEach((count, card) => {
        console.log(`${index}: ${count}x ${card.toString()}`);
        index++;
    });
    console.log("使用するカードの番号をカンマ区切りで入力してください。");
    const input = await getInput();
    const indices = input.split(",").map((s) => parseInt(s.trim(), 10));
    const selectedCards = indices.map((i) => allCards[i]).filter((c) => c !== undefined);
    const base = selectedCards[0];
    if (base && base.canUseOptions) { }
}
export async function inputSelectOptions(player) {
    const { hp, mp, gold } = player;
    const maxTotal = hp + mp + gold;
    const options = {
        hp,
        mp,
        gold
    };
    console.log("使用オプションを選択してください:");
    while (true) {
        const optionIndex = await inputSelectIndex("オプションを選択してください:", [
            "完了",
            `HPを設定 (現在: ${options.hp})`,
            `MPを設定 (現在: ${options.mp})`,
            `Goldを設定 (現在: ${options.gold})`,
            "自動調整"
        ]);
        if (optionIndex === 0) {
            return options;
        }
        else if (optionIndex === 1) {
            const hp = await inputInt("設定するHPを入力してください:");
            if (hp < 0) {
                console.log("HPは0以上の値を入力してください。");
                continue;
            }
            options.hp = hp;
        }
        else if (optionIndex === 2) {
            const mp = await inputInt("設定するMPを入力してください:");
            if (mp < 0) {
                console.log("MPは0以上の値を入力してください。");
                continue;
            }
            options.mp = mp;
        }
        else if (optionIndex === 3) {
            const gold = await inputInt("設定するGoldを入力してください:");
            if (gold < 0) {
                console.log("Goldは0以上の値を入力してください。");
                continue;
            }
            options.gold = gold;
        }
        else if (optionIndex === 4) {
            const optionTotal = (options.hp ?? 0) + (options.mp ?? 0) + (options.gold ?? 0);
            let diff = maxTotal - optionTotal;
            const v = -diff / Math.abs(diff);
            if (diff === 0) {
                console.log("既に合計が最大値と等しいため、自動調整は不要です。");
            }
            else {
                while (diff !== 0) {
                    if (options.gold + v >= 0) {
                        options.gold = options.gold + v;
                        diff -= v;
                    }
                    else if (options.mp + v >= 0) {
                        options.mp = options.mp + v;
                        diff -= v;
                    }
                    else if (options.hp + v >= 0) {
                        options.hp = options.hp + v;
                        diff -= v;
                    }
                }
            }
            return options;
        }
    }
}
