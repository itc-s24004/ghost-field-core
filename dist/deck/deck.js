import { GF_Card } from "../card/card.js";
import { GF_Element } from "../card/element.js";
import { GF_Error_Undefined } from "../game/error.js";
import { generateTable } from "../table/table.js";
export class GF_Deck {
    #cards;
    #draw;
    #elementDeckTable;
    constructor(initialData) {
        this.#cards = new Map(initialData.map(c => new GF_Card(c)).map(c => [c.id, c]));
        // デッキテーブルの生成
        const tableEntries = this.#cards.entries().map(([id, card]) => [card, card.weight]).toArray();
        this.#draw = generateTable(new Map(tableEntries));
        // 属性ごとのデッキテーブルを生成
        const baseTable = new Map(Object.values(GF_Element).map(element => [element, new Map()]));
        // console.log(baseTable)
        const elementTable = tableEntries.reduce((table, [cards, weight]) => {
            const element = cards.element;
            table.get(element)?.set(cards, weight);
            return table;
        }, baseTable);
        elementTable.forEach((cardMap, element) => {
            if (element === GF_Element.Empty)
                return;
            if (cardMap.size === 0)
                throw new GF_Error_Undefined(`${element} 属性のカードが存在しません`);
        });
        this.#elementDeckTable = new Map(elementTable.entries().map(([element, cardMap]) => [element, generateTable(cardMap)]));
    }
    get allCards() {
        return this.#cards.values().toArray();
    }
    /**
     * 指定したカードIDのカードを取得する
     * @param cardID
     * @returns
     */
    getCardByID(cardID) {
        return this.#cards.get(cardID);
    }
    /**
     * カードを1枚引く
     * @returns
     */
    drawCard() {
        return this.#draw();
    }
}
/**
 * プレイヤーのデッキ
 */
export class GF_PlayerDeck {
    /**手札 */
    #hand = new Map();
    //!!! 今後魔法を重複できるようにMapで実装
    /**魔法スタック */
    #magicStack = new Map();
    /**山札 */
    #deck;
    /**最大手札枚数 */
    #maxHandSize;
    /**最大魔法スタック枚数 */
    #maxMagicStackSize;
    #src;
    constructor(src, deck, maxHandSize = 5, maxMagicStackSize = 5) {
        this.#src = src;
        this.#deck = deck;
        this.#maxHandSize = maxHandSize;
        this.#maxMagicStackSize = maxMagicStackSize;
    }
    get totalHandCount() {
        return this.#hand.values().reduce((a, b) => a + b, 0);
    }
    get totalMagicStackCount() {
        return this.#magicStack.values().reduce((a, b) => a + b, 0);
    }
    get hand() {
        return this.#hand;
    }
    get magicStack() {
        return this.#magicStack;
    }
    /**
     * 指定したカードが手札に存在するかどうかを取得する
     * @param card
     * @returns
     */
    hasCard(card) {
        return this.#hand.has(card);
    }
    /**
     * 指定したカードの枚数を取得する
     * @param card
     * @returns
     */
    getCardCount(card) {
        return this.#hand.get(card) ?? 0;
    }
    getMagicStackCount(card) {
        return this.#magicStack.get(card) ?? 0;
    }
    /**
     * 指定したカードが手札に指定枚数以上あるかどうかを取得する
     * @param cards
     * @returns
     */
    hasCards(cards) {
        for (const [card, count] of cards) {
            const haveCount = this.#hand.get(card) ?? 0;
            if (haveCount < count)
                return false;
        }
        return true;
    }
    hasMagicCards(cards) {
        for (const [card, count] of cards) {
            const haveCount = this.#magicStack.get(card) ?? 0;
            if (haveCount < count)
                return false;
        }
        return true;
    }
    hasAttackCard() {
        return this.#hand.keys().find(card => card.isAttack) !== undefined;
    }
    /**
     * 魔法でない攻撃カードが手札に存在するかどうか
     * @returns
     */
    hasCanUseCard() {
        return this.#hand.keys().find(card => card.isAttack && !card.isMagic) !== undefined;
    }
    setCard(card, count) {
        if (count < 1) {
            this.#hand.delete(card);
        }
        else {
            this.#hand.set(card, count);
        }
    }
    setMagicStack(card, count) {
        if (count < 1) {
            this.#magicStack.delete(card);
        }
        else {
            this.#magicStack.set(card, count);
        }
    }
    /**
     * カードを1枚引く
     */
    drawCard() {
        const card = this.#deck.drawCard();
        const removedCard = this.#addCard(card);
        return {
            drawnCard: card,
            removedCard
        };
    }
    /**
     * 指定したカードを使用する\
     * 効果処理は行いません
     * @param data
     * @returns
     */
    useCard(data) {
        //使用するカードの枚数を集計
        const cardMap = data.cards.reduce((map, card) => {
            const count = map.get(card) ?? 0;
            map.set(card, count + 1);
            return map;
        }, new Map());
        //MPが足りているか確認
        if (this.#src.mp < data.cost)
            throw new GF_Error_Undefined("MPが不足しています。");
        const usedCards = new Map();
        const stackCards = new Map();
        const result = {
            usedCards,
            stackCards
        };
        //魔法カードが既に魔法スタックに存在するか確認
        if (data.isMagic && this.hasMagicCards(cardMap))
            return result;
        //手札に指定枚数あるか確認
        const hasCards = this.hasCards(cardMap);
        if (!hasCards)
            throw new GF_Error_Undefined("指定したカードが手札に存在しません。");
        cardMap.forEach((count, card) => {
            //手札から指定枚数減少
            const haveCount = this.getCardCount(card);
            this.setCard(card, haveCount - count);
            usedCards.set(card, count);
            //魔法カードの場合、魔法スタックに追加
            if (card.isMagic) {
                this.addMagicStack(card);
                stackCards.set(card, count);
            }
        });
        return result;
    }
    addMagicStack(...cards) {
        cards.forEach(card => {
            const count = this.getMagicStackCount(card);
            if (count === undefined) {
                if (this.totalMagicStackCount >= this.#maxMagicStackSize) {
                    throw new GF_Error_Undefined("魔法スタックの最大枚数を超えています。");
                }
                this.setMagicStack(card, 1);
            }
            else {
                this.#magicStack.set(card, count + 1);
            }
        });
    }
    #addCard(card) {
        const count = this.getCardCount(card);
        this.setCard(card, count + 1);
        if (this.totalHandCount > this.#maxHandSize) {
            const cardToRemove = this.getRandomHandCard();
            const removeCount = this.getCardCount(cardToRemove);
            this.setCard(cardToRemove, removeCount - 1);
            return cardToRemove;
        }
    }
    getRandomHandCard(useWeight = false) {
        if (useWeight) {
            const table = generateTable(this.#hand);
            return table();
        }
        else {
            const cards = this.#hand.keys().toArray();
            return cards[Math.floor(Math.random() * this.#hand.size)];
        }
    }
}
