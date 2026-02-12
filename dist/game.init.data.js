import { GF_Element } from "./card/element.js";
export const GameInitData = {
    cards: [
        {
            id: "gf:exchange",
            name: "両替券",
            price: 0,
            cost: 0,
            isMagic: false,
            element: GF_Element.Normal,
            offensive: {
                type: "exchange",
            },
            weight: 5
        },
        {
            id: "sell",
            name: "ブラックチケット",
            price: 0,
            cost: 0,
            isMagic: false,
            element: GF_Element.Normal,
            offensive: {
                type: "sell"
            },
            weight: 5
        },
        {
            id: "fireball",
            name: "ファイアボール",
            price: 0,
            cost: 0,
            isMagic: true,
            element: GF_Element.Fire,
            offensive: {
                type: "attack",
                value: 5,
                multiUse: false,
                rate: 1
            },
            weight: 5
        },
        {
            id: "gf:sword",
            name: "剣",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Normal,
            offensive: {
                type: "attack",
                multiUse: false,
                rate: 1,
                value: 5
            },
            weight: 5
        },
        {
            id: "gf:combat_knife",
            name: "コンバットナイフ",
            price: 8,
            cost: 0,
            isMagic: false,
            element: GF_Element.Normal,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 3
            },
            weight: 5
        },
        {
            id: "gf:shield",
            name: "盾",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Normal,
            defensive: {
                type: "defense",
                multiUse: true,
                value: 5
            },
            weight: 5
        },
        {
            id: "gf:small_shield",
            name: "小さな盾",
            price: 3,
            cost: 0,
            isMagic: false,
            element: GF_Element.Normal,
            defensive: {
                type: "defense",
                multiUse: true,
                value: 3
            },
            weight: 5
        },
        {
            id: "gf:healing_magic",
            name: "回復魔法",
            price: 10,
            isMagic: true,
            element: GF_Element.Normal,
            offensive: {
                type: "heal",
                healType: "mp",
                value: "mp"
            },
            cost: "mp",
            weight: 5
        },
        {
            id: "gf:normal",
            name: "無属性",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Normal,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:fire",
            name: "火",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Fire,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:water",
            name: "水",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Water,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:wind",
            name: "風",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Wind,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:stone",
            name: "石",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Stone,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:dark",
            name: "闇",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Dark,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:light",
            name: "光",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Light,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:lightning",
            name: "雷",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Lightning,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        },
        {
            id: "gf:wood",
            name: "木",
            price: 5,
            cost: 0,
            isMagic: false,
            element: GF_Element.Wood,
            offensive: {
                type: "attack",
                multiUse: true,
                rate: 1,
                value: 4
            },
            weight: 5
        }
    ],
    meta: {}
};
