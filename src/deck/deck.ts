import { GF_Card } from "../card/card.js";
import type { GF_Card_ID, GF_CardComponent } from "../card/component.js";
import { GF_Element } from "../card/element.js";
import type { GF_EX_GameData } from "../game/action.js";
import { GF_Error_Undefined } from "../game/error.js";
import type { GF_Player } from "../player/player.js";
import { generateTable } from "../table/table.js";
import { GF_CardMixData_All } from "../util/card/index.js";


type DrawCallback<EX_Card extends GF_EX_GameData> = () => GF_Card<EX_Card>;


export class GF_Deck<EX_Card extends GF_EX_GameData = {}> {

    #cards: Map<GF_Card_ID, GF_Card<EX_Card>>;
    #draw: DrawCallback<EX_Card>;


    #elementDeckTable: Map<GF_Element, DrawCallback<EX_Card>>;

    constructor(initialData: GF_CardComponent<EX_Card>[]) {
        this.#cards = new Map<GF_Card_ID, GF_Card<EX_Card>>(initialData.map(c => new GF_Card<EX_Card>(c)).map(c => [c.id, c]));

        // デッキテーブルの生成
        const tableEntries = this.#cards.entries().map(([id, card]) => [card, card.weight] as [GF_Card<EX_Card>, number]).toArray();




        this.#draw = generateTable<GF_Card<EX_Card>>(new Map<GF_Card<EX_Card>, number>(tableEntries));
        // 属性ごとのデッキテーブルを生成
        const baseTable = new Map(Object.values(GF_Element).map(element => [element, new Map<GF_Card<EX_Card>, number>()]));

        // console.log(baseTable)

        const elementTable: Map<GF_Element, Map<GF_Card<EX_Card>, number>> = tableEntries.reduce((table, [cards, weight]) => {
            const element = cards.element;
            table.get(element)?.set(cards, weight);
            return table;
        }, baseTable);


        elementTable.forEach((cardMap, element) => {
            if (element === GF_Element.Empty) return;
            if (cardMap.size === 0) throw new GF_Error_Undefined(`${element} 属性のカードが存在しません`);
        });

        this.#elementDeckTable = new Map<GF_Element, DrawCallback<EX_Card>>(
            elementTable.entries().map(([element, cardMap]) => [element, generateTable<GF_Card<EX_Card>>(cardMap)])
        );
    }


    get allCards(): GF_Card<EX_Card>[] {
        return this.#cards.values().toArray();
    }


    /**
     * 指定したカードIDのカードを取得する
     * @param cardID 
     * @returns 
     */
    getCardByID(cardID: GF_Card_ID): GF_Card<EX_Card> | undefined {
        return this.#cards.get(cardID);
    }


    /**
     * カードを1枚引く
     * @returns 
     */
    drawCard(): GF_Card<EX_Card> {
        return this.#draw();
    }
}


























/**
 * プレイヤーのデッキ
 */
export class GF_PlayerDeck<EX_Card extends GF_EX_GameData = {}> {
    /**手札 */
    #hand: Map<GF_Card<EX_Card>, number> = new Map();


    //!!! 今後魔法を重複できるようにMapで実装
    /**魔法スタック */
    #magicStack: Map<GF_Card<EX_Card>, number> = new Map();
    /**山札 */
    #deck: GF_Deck<EX_Card>;
    /**最大手札枚数 */
    #maxHandSize: number;
    /**最大魔法スタック枚数 */
    #maxMagicStackSize: number;

    #src: GF_Player<EX_Card>;
    constructor(src: GF_Player<EX_Card>, deck: GF_Deck<EX_Card>, maxHandSize: number = 5, maxMagicStackSize: number = 5) {
        this.#src = src;
        this.#deck = deck;
        this.#maxHandSize = maxHandSize;
        this.#maxMagicStackSize = maxMagicStackSize;
    }


    get totalHandCount(): number {
        return this.#hand.values().reduce((a, b) => a + b, 0);
    }

    get totalMagicStackCount(): number {
        return this.#magicStack.values().reduce((a, b) => a + b, 0);
    }

    get hand(): Map<GF_Card<EX_Card>, number> {
        return this.#hand;
    }

    get magicStack(): Map<GF_Card<EX_Card>, number> {
        return this.#magicStack;
    }

    /**
     * 指定したカードが手札に存在するかどうかを取得する
     * @param card 
     * @returns 
     */
    hasCard(card: GF_Card<EX_Card>): boolean {
        return this.#hand.has(card);
    }

    /**
     * 指定したカードの枚数を取得する
     * @param card 
     * @returns 
     */
    getCardCount(card: GF_Card<EX_Card>): number {
        return this.#hand.get(card) ?? 0;
    }

    getMagicStackCount(card: GF_Card<EX_Card>): number {
        return this.#magicStack.get(card) ?? 0;
    }


    /**
     * 指定したカードが手札に指定枚数以上あるかどうかを取得する
     * @param cards 
     * @returns 
     */
    hasCards(cards: Map<GF_Card<EX_Card>, number>): boolean {
        for (const [card, count] of cards) {
            const haveCount = this.#hand.get(card) ?? 0;
            if (haveCount < count) return false;
        }
        return true;
    }

    hasMagicCards(cards: Map<GF_Card<EX_Card>, number>): boolean {
        for (const [card, count] of cards) {
            const haveCount = this.#magicStack.get(card) ?? 0;
            if (haveCount < count) return false;
        }
        return true;
    }


    hasAttackCard(): boolean {
        return this.#hand.keys().find(card => card.isAttack) !== undefined;
    }

    /**
     * 魔法でない攻撃カードが手札に存在するかどうか
     * @returns 
     */
    hasCanUseCard(): boolean {
        return this.#hand.keys().find(card => card.isAttack && !card.isMagic) !== undefined;
    }



    setCard(card: GF_Card<EX_Card>, count: number) {
        if (count < 1) {
            this.#hand.delete(card);

        } else {
            this.#hand.set(card, count);
            
        }
    }

    setMagicStack(card: GF_Card<EX_Card>, count: number) {
        if (count < 1) {
            this.#magicStack.delete(card);

        } else {
            this.#magicStack.set(card, count);
            
        }
    }


    /**
     * カードを1枚引く
     */
    drawCard(): GF_PlayerDrawResult<EX_Card> {
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
    useCard(data: GF_CardMixData_All<EX_Card>): GF_UseCardResult<EX_Card> {
        //使用するカードの枚数を集計
        const cardMap = data.cards.reduce<Map<GF_Card<EX_Card>, number>>((map, card) => {
            const count = map.get(card) ?? 0;
            map.set(card, count + 1);
            return map;
        }, new Map());


        //MPが足りているか確認
        if (this.#src.mp < data.cost) throw new GF_Error_Undefined("MPが不足しています。");

        const usedCards: Map<GF_Card<EX_Card>, number> = new Map();
        const stackCards: Map<GF_Card<EX_Card>, number> = new Map();
        const result = {
            usedCards,
            stackCards
        }


        //魔法カードが既に魔法スタックに存在するか確認
        if (data.isMagic && this.hasMagicCards(cardMap)) return result;

        //手札に指定枚数あるか確認
        const hasCards = this.hasCards(cardMap);
        if (!hasCards) throw new GF_Error_Undefined("指定したカードが手札に存在しません。");
        
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


    addMagicStack(...cards: GF_Card<EX_Card>[]) {
        cards.forEach(card => {
            const count = this.getMagicStackCount(card);
            if (count === undefined) {
                if (this.totalMagicStackCount >= this.#maxMagicStackSize) {
                    throw new GF_Error_Undefined("魔法スタックの最大枚数を超えています。");
                }
                this.setMagicStack(card, 1);
            } else {
                this.#magicStack.set(card, count + 1);
            }
        });
    }

    
    #addCard(card: GF_Card<EX_Card>): GF_Card<EX_Card> | undefined {
        const count = this.getCardCount(card);
        this.setCard(card, count + 1);
        if (this.totalHandCount > this.#maxHandSize) {
            const cardToRemove = this.getRandomHandCard();
            const removeCount = this.getCardCount(cardToRemove);
            this.setCard(cardToRemove, removeCount - 1);
            return cardToRemove;
        }
    }



    getRandomHandCard(useWeight: boolean = false) {
        if (useWeight) {
            const table = generateTable<GF_Card<EX_Card>>(this.#hand);
            return table();
        } else {
            const cards = this.#hand.keys().toArray();
            return cards[Math.floor(Math.random() * this.#hand.size)] as GF_Card<EX_Card>;
        }
    }


}


export type GF_PlayerHand<EX_Card extends GF_EX_GameData = {}> = {
    hand: Map<GF_Card<EX_Card>, number>;
    magicStack: Map<GF_Card<EX_Card>, number>;

}




export type GF_PlayerDrawResult<EX_Card extends GF_EX_GameData> = {
    drawnCard: GF_Card<EX_Card>;
    removedCard: GF_Card<EX_Card> | undefined;
}


export type GF_UseCardResult<EX_Card extends GF_EX_GameData> = {
    usedCards: Map<GF_Card<EX_Card>, number>;
    stackCards: Map<GF_Card<EX_Card>, number>;
}