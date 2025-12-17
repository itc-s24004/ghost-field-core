import type { GhostField_CardComponent, GhostField_CardID } from "./card/type.js";
import { GhostField_CardDeck } from "./deck/index.js";
import { GhostField_PlayerID } from "./player/index.js";

export enum GhostField_Element {
    Normal = "normal",
    Fire = "fire",
    Water = "water",
    Wood = "wood",
    Stone = "stone",
    Light = "light",
    Dark = "dark"
}



export enum Effect {
    Cold="cold",
    Fever="fever",
    Hell="hell",
    Heven="heaven",

    Fog="fog",
    Flash="flash",
    Dream="dream",
    Dark="dark"
}




export class GhostField<card extends GhostField_Custom = {}, ghost extends GhostField_Custom = {}, game extends GhostField_Custom = {}> {
    get initData() {
        return this.#deck.allCards;
    }
    
    #deck;
    constructor(data: GhostField_InitialData<card, ghost, game>) {
        this.#deck = new GhostField_CardDeck<card>(data.card);
    }

    start(player: number) {
        
    }

    
    on() {
        
    }


    close() {
        
    }


    playerAction() {
        
    }


    toJSON(): GhostField_InitialData<card, ghost, game> {
        return {
            card: this.#deck.toJSON(),
            ghost: {}
        };
    }
}













export type Game_Value = number | "hp" | "mp" | "gold";



export type Card_After_Variable = {
    hp: number;
    mp: number;
    gold: number;

    card: GhostField_CardID;

    src: GhostField_PlayerID;
    target: GhostField_PlayerID[];

    damage: number;
    heal: number;

    effect: Effect[];
}




// !!!AI
export type Card_After_Variable_Insert<T, R extends boolean = false> = 
R extends true ? T |
{
    [K in keyof Card_After_Variable]: Card_After_Variable[K] extends T ? K : never
}[keyof Card_After_Variable]
:
{
    [K in keyof Card_After_Variable]: Card_After_Variable[K] extends T ? K : never
}[keyof Card_After_Variable];


export type GhostField_InitialData<card extends GhostField_Custom = {}, ghost extends GhostField_Custom = {}, game extends GhostField_Custom = {}> = {
    card: GhostField_InitialData_Card<card>;
    // 後で追加
    ghost: {
        
    };

    custom?: game;
};


export type GhostField_InitialData_Card<T extends GhostField_Custom = {}> = {
    data: GhostField_CardComponent<T>[];
    table: {
        [id: GhostField_CardID]: number;
    };
}


export type GhostField_Custom = Record<string, unknown>;




export type GhostField_TickID = string & {brand: "GhostField_TickID"};

export type GhostField_SystemTick = {
    tick_id: GhostField_TickID;
    type: "use_card";
    cards: GhostField_CardID[];
    src: GhostField_PlayerID;
    target: GhostField_PlayerID;
} | {
    tick_id: GhostField_TickID;
    type: ""
}


export * from "./card/index.js";
export * from "./deck/index.js";
export * from "./player/index.js";