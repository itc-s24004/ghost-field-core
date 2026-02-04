import type { GF_EX_GameData } from "../game/action";
import type { GF_GameValue, GF_Player, GF_PlayerStatusType } from "../player/player";
import type { GF_Card_ID, GF_CardComponent, GF_OffensiveComponent } from "./component";
import { GF_Element, GF_ElementMixer } from "./element";
import { GF_CardError_ComponentConflict, GF_CardError_MultiUseRequired, GF_CardError_NoDefensiveComponent, GF_CardError_NoOffensiveComponent } from "./error";





export type GF_CardUseOptions = {
    hp?: number;
    mp?: number;
    gold?: number;
}

export type GF_CardMixOptions<EX_Card extends GF_EX_GameData = {}> = GF_CardUseOptions & {
    cards?: GF_Card<EX_Card>[];
}



function genToValue(src: GF_Player) {
    return (gameValue: GF_GameValue | undefined): number => {
        if (typeof gameValue === "number") {
            return gameValue;

        } else if (gameValue === undefined) {
            return 0;

        } else {
            return src[gameValue];

        }
    };
}


export class GF_Card<EX_Card extends GF_EX_GameData = {}> {
    /**
     * カードを使用する（攻撃・売却・両替・回復）\
     * 攻撃カード以外を使用した場合、エラーが発生します
     * @param src 
     * @param baseCard 
     * @param options 
     * @returns 
     */
    static useOffensive<EX_Card extends GF_EX_GameData = {}>(src: GF_Player, baseCard: GF_Card<EX_Card>, options?: GF_CardMixOptions<EX_Card>) {
        const {
            cards = [],
            hp = 0,
            mp = 0,
            gold = 0
        } = options ?? {};


        const toValue = genToValue(src);

        const offensiveComp = baseCard.#offensiveComponent;
        const isMagic = baseCard.isMagic;
        if (offensiveComp.type === "attack") {

            
            const data: GF_CardMixData_Attack<EX_Card> = {
                type: "attack",
                cards: [baseCard],
                element: baseCard.element,
                value: toValue(offensiveComp.value),
                cost: toValue(baseCard.cost),
                rate: offensiveComp.rate,
                isMagic
            }
            // 追加カードの合成
            if (cards.length !== 0) {
                if (isMagic) throw new GF_CardError_ComponentConflict("魔法カードは追加カードを使用できません");
                if (data.rate !== 1) throw new GF_CardError_ComponentConflict("追加カードを使用する場合、命中率は100%である必要があります");
                const mixData = cards.reduce<GF_CardMixData_Attack<EX_Card>>((data, card) => {
                    if (card.isMagic) throw new GF_CardError_ComponentConflict("魔法カードは同時使用できません");
                    const comp = card.#offensiveComponent;
                    if (comp.type !== "attack") throw new GF_CardError_ComponentConflict("追加カードのコンポーネントは攻撃である必要があります");
                    if (!comp.multiUse) throw new GF_CardError_ComponentConflict("追加カードの攻撃コンポーネントは同時使用可能である必要があります");
                    if (comp.rate !== 1) throw new GF_CardError_ComponentConflict("追加カードの命中率は100%である必要があります");
                    data.value += toValue(comp.value);
                    data.cost += toValue(card.cost);
                    data.element = GF_ElementMixer(data.element, card.element);
                    data.cards.push(card);
                    return data;
                }, data);
                return mixData;

            }
            return data;


        } else if (offensiveComp.type === "sell") {
            if (cards.length !== 1) throw new GF_CardError_MultiUseRequired("売却するカードを1枚指定する必要があります");
            const sellCard = cards[0] as GF_Card<EX_Card>;
            const data: GF_CardMixData_Sell<EX_Card> = {
                type: "sell",
                cards: [baseCard, sellCard],
                element: baseCard.element,
                value: sellCard.price,
                isMagic,
                cost: toValue(baseCard.cost)
            }
            return data;
            

        } else if (offensiveComp.type === "exchange") {
            if (cards.length !== 0) throw new GF_CardError_MultiUseRequired("両替カードは単独で使用する必要があります");
            if (!Number.isInteger(hp) || hp < 0) throw new GF_CardError_ComponentConflict("両替するHPは0以上の整数である必要があります");
            if (!Number.isInteger(mp) || mp < 0) throw new GF_CardError_ComponentConflict("両替するMPは0以上の整数である必要があります");
            if (!Number.isInteger(gold) || gold < 0) throw new GF_CardError_ComponentConflict("両替するゴールドは0以上の整数である必要があります");
            if (hp + mp + gold > src.hp + src.mp + src.gold) throw new GF_CardError_ComponentConflict("両替後の合計値が所持値を超えています");

            const data: GF_CardMixData_Exchange<EX_Card> = {
                type: "exchange",
                cards: [baseCard],
                element: baseCard.element,
                hp,
                mp,
                gold,
                cost: toValue(baseCard.cost),
                isMagic
            }
            return data;


        } else if (offensiveComp.type === "heal") {
            if (cards.length !== 0) throw new GF_CardError_MultiUseRequired("回復カードは単独で使用する必要があります");
            const data: GF_CardMixData_Heal<EX_Card> = {
                type: "heal",
                healType: offensiveComp.healType,
                cards: [baseCard],
                element: baseCard.element,
                value: toValue(offensiveComp.value),
                cost: toValue(baseCard.cost),
                isMagic
            }
            return data;


        }
        throw new GF_CardError_ComponentConflict("不明な攻撃コンポーネントです");


    }



    static useDefensive<EX_Card extends GF_EX_GameData = {}>(src: GF_Player, baseCard?: GF_Card<EX_Card>, options?: GF_CardMixOptions<EX_Card>): GF_CardMixData_Defense<EX_Card> {
        const {
            cards = []
        } = options ?? {};

        const toValue = genToValue(src);

        if (!baseCard) {
            return {
                type: "defense",
                cards: [],
                element: GF_Element.Empty,
                value: 0,
                isMagic: false,
                cost: 0
            }
        }

        // 防御コンポーネントの取得
        const defensiveComp = baseCard.#defensiveComponent;
        const isMagic = baseCard.isMagic;
        if (defensiveComp.type === "defense") {
            const data: GF_CardMixData_Defense<EX_Card> = {
                type: "defense",
                cards: [baseCard],
                element: baseCard.element,
                value: toValue(defensiveComp.value),
                cost: toValue(baseCard.cost),
                isMagic
            }
            // 追加カードの合成
            if (cards.length !== 0) {
                if (isMagic) throw new GF_CardError_ComponentConflict("魔法カードは追加カードを使用できません");
                const mixData = cards.reduce<GF_CardMixData_Defense<EX_Card>>((data, card) => {
                    const comp = card.#defensiveComponent;
                    if (comp.type !== "defense") throw new GF_CardError_ComponentConflict("追加カードのコンポーネントは防御である必要があります");
                    if (card.isMagic) throw new GF_CardError_ComponentConflict("追加カードに魔法カードを使用できません");
                    if (!comp.multiUse) throw new GF_CardError_ComponentConflict("追加カードの防御コンポーネントは同時使用可能である必要があります");
                    data.value += toValue(comp.value);
                    data.cost += toValue(card.cost);
                    data.element = GF_ElementMixer(data.element, card.element);
                    data.cards.push(card);
                    return data;
                }, data);
                return mixData;

            }
            return data;

        }
        throw new GF_CardError_ComponentConflict("不明な防御コンポーネントです");



    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    #component: GF_CardComponent<EX_Card>;
    constructor(component: GF_CardComponent<EX_Card>) {
        this.#component = component;
    }

    get id(): GF_Card_ID {
        return this.#component.id;
    }

    get element(): GF_Element {
        return this.#component.element;
    }

    get isMagic(): boolean {
        return this.#component.isMagic;
    }

    get isAttack(): boolean {
        return this.#component.offensive?.type === "attack";
    }

    /**
     * 使用オプションが利用可能かどうか
     */
    get canUseOptions(): boolean {
        const offensive = this.#component.offensive;
        return (offensive !== undefined && offensive.type === "exchange");
    }

    get cost() {
        return this.#component.cost;
    }

    get price() {
        return this.#component.price;
    }

    get name(): string {
        return this.#component.name;
    }

    get weight(): number {
        return this.#component.weight;
    }


    get #offensiveComponent(): GF_OffensiveComponent {
        if (!this.#component.offensive) throw new GF_CardError_NoOffensiveComponent("攻撃コンポーネントが存在しません");
        return this.#component.offensive;
    }


    get #defensiveComponent() {
        if (!this.#component.defensive) throw new GF_CardError_NoDefensiveComponent("防御コンポーネントが存在しません");
        return this.#component.defensive;
    }





    toString(): string {
        return JSON.stringify(this.#component);
    }
}




export type GF_CardMixData_Offensive<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Attack<EX_Card> | GF_CardMixData_Heal<EX_Card> | GF_CardMixData_Exchange<EX_Card> | GF_CardMixData_Sell<EX_Card>;

export type GF_CardMixData_Defensive<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Defense<EX_Card>;

export type GF_CardMixData_All<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Offensive<EX_Card> | GF_CardMixData_Defensive<EX_Card>;

export type GF_CardMixData<EX_Card extends GF_EX_GameData = {}> = {
    type: string;
    cards: GF_Card<EX_Card>[];
    element: GF_Element;
    isMagic: boolean;
    cost: number;
}


export type GF_CardMixData_Attack<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "attack";

    value: number;
    rate: number;
}

export type GF_CardMixData_Defense<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "defense";

    value: number;
}

export type GF_CardMixData_Heal<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "heal";

    healType: GF_PlayerStatusType;

    value: number;
}

export type GF_CardMixData_Exchange<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "exchange";

    hp: number;
    mp: number;
    gold: number;
}

export type GF_CardMixData_Sell<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
    type: "sell";
    
    value: number;
}


// export type GF_CardMixData_Draw<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData<EX_Card> & {
//     type: "draw";
// }