import { GF_Element } from "../../card/element.js";
import { GF_CardError_ComponentConflict, GF_CardError_MultiUseRequired } from "../../card/error.js";
import { mixElement } from "../element/index.js";
function genToValue(src) {
    return (gameValue) => {
        if (typeof gameValue === "number") {
            return gameValue;
        }
        else if (gameValue === undefined) {
            return 0;
        }
        else {
            return src[gameValue];
        }
    };
}
export function useOffensive(src, baseCard, options) {
    const { cards = [], hp = 0, mp = 0, gold = 0 } = options ?? {};
    const toValue = genToValue(src);
    const offensiveComp = baseCard.offensiveComponent;
    const isMagic = baseCard.isMagic;
    if (offensiveComp.type === "attack") {
        const data = {
            type: "attack",
            cards: [baseCard],
            element: baseCard.element,
            value: toValue(offensiveComp.value),
            cost: toValue(baseCard.cost),
            rate: offensiveComp.rate,
            isMagic
        };
        // 追加カードの合成
        if (cards.length !== 0) {
            if (isMagic)
                throw new GF_CardError_ComponentConflict("魔法カードは追加カードを使用できません");
            if (data.rate !== 1)
                throw new GF_CardError_ComponentConflict("追加カードを使用する場合、命中率は100%である必要があります");
            const mixData = cards.reduce((data, card) => {
                if (card.isMagic)
                    throw new GF_CardError_ComponentConflict("魔法カードは同時使用できません");
                const comp = card.offensiveComponent;
                if (comp.type !== "attack")
                    throw new GF_CardError_ComponentConflict("追加カードのコンポーネントは攻撃である必要があります");
                if (!comp.multiUse)
                    throw new GF_CardError_ComponentConflict("追加カードの攻撃コンポーネントは同時使用可能である必要があります");
                if (comp.rate !== 1)
                    throw new GF_CardError_ComponentConflict("追加カードの命中率は100%である必要があります");
                data.value += toValue(comp.value);
                data.cost += toValue(card.cost);
                data.element = mixElement(data.element, card.element);
                data.cards.push(card);
                return data;
            }, data);
            return mixData;
        }
        return data;
    }
    else if (offensiveComp.type === "sell") {
        if (cards.length !== 1)
            throw new GF_CardError_MultiUseRequired("売却するカードを1枚指定する必要があります");
        const sellCard = cards[0];
        const data = {
            type: "sell",
            cards: [baseCard, sellCard],
            element: baseCard.element,
            value: sellCard.price,
            isMagic,
            cost: toValue(baseCard.cost)
        };
        return data;
    }
    else if (offensiveComp.type === "exchange") {
        if (cards.length !== 0)
            throw new GF_CardError_MultiUseRequired("両替カードは単独で使用する必要があります");
        if (!Number.isInteger(hp) || hp < 0)
            throw new GF_CardError_ComponentConflict("両替するHPは0以上の整数である必要があります");
        if (!Number.isInteger(mp) || mp < 0)
            throw new GF_CardError_ComponentConflict("両替するMPは0以上の整数である必要があります");
        if (!Number.isInteger(gold) || gold < 0)
            throw new GF_CardError_ComponentConflict("両替するゴールドは0以上の整数である必要があります");
        if (hp + mp + gold > src.hp + src.mp + src.gold)
            throw new GF_CardError_ComponentConflict("両替後の合計値が所持値を超えています");
        const data = {
            type: "exchange",
            cards: [baseCard],
            element: baseCard.element,
            hp,
            mp,
            gold,
            cost: toValue(baseCard.cost),
            isMagic
        };
        return data;
    }
    else if (offensiveComp.type === "heal") {
        if (cards.length !== 0)
            throw new GF_CardError_MultiUseRequired("回復カードは単独で使用する必要があります");
        const data = {
            type: "heal",
            healType: offensiveComp.healType,
            cards: [baseCard],
            element: baseCard.element,
            value: toValue(offensiveComp.value),
            cost: toValue(baseCard.cost),
            isMagic
        };
        return data;
    }
    throw new GF_CardError_ComponentConflict("不明な攻撃コンポーネントです");
}
export function useDefensive(src, baseCard, options) {
    const { cards = [] } = options ?? {};
    const toValue = genToValue(src);
    if (!baseCard) {
        return {
            type: "defense",
            cards: [],
            element: GF_Element.Empty,
            value: 0,
            isMagic: false,
            cost: 0
        };
    }
    // 防御コンポーネントの取得
    const defensiveComp = baseCard.defensiveComponent;
    const isMagic = baseCard.isMagic;
    if (defensiveComp.type === "defense") {
        const data = {
            type: "defense",
            cards: [baseCard],
            element: baseCard.element,
            value: toValue(defensiveComp.value),
            cost: toValue(baseCard.cost),
            isMagic
        };
        // 追加カードの合成
        if (cards.length !== 0) {
            if (isMagic)
                throw new GF_CardError_ComponentConflict("魔法カードは追加カードを使用できません");
            const mixData = cards.reduce((data, card) => {
                const comp = card.defensiveComponent;
                if (comp.type !== "defense")
                    throw new GF_CardError_ComponentConflict("追加カードのコンポーネントは防御である必要があります");
                if (card.isMagic)
                    throw new GF_CardError_ComponentConflict("追加カードに魔法カードを使用できません");
                if (!comp.multiUse)
                    throw new GF_CardError_ComponentConflict("追加カードの防御コンポーネントは同時使用可能である必要があります");
                data.value += toValue(comp.value);
                data.cost += toValue(card.cost);
                data.element = mixElement(data.element, card.element);
                data.cards.push(card);
                return data;
            }, data);
            return mixData;
        }
        return data;
    }
    throw new GF_CardError_ComponentConflict("不明な防御コンポーネントです");
}
