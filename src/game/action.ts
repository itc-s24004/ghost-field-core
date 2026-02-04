import type { GF_CardMixData_Attack, GF_CardMixData_Offensive } from "../card/card";
import type { GF_Card_ID } from "../card/component";
import type { GF_Element } from "../card/element";
import { GF_Player } from "../player/player"

// export type GF_SystemAction = {
//     type: string;
//     src: GF_Player;
//     cards: GF_Card_ID[];
// }

// export type GF_SystemAction_Offensive = GF_SystemAction & {
//     target: GF_Player;
//     isMiss: boolean;
// }


// export type GF_SystemAction_Attack = GF_SystemAction_Offensive & {
//     type: "systemAction_attack";
//     element: GF_Element;
//     damage: number;
// }


// export type GF_SystemAction_Sell = GF_SystemAction & {
//     type: "systemAction_sell";
// }


// export type GF_SystemAction_Buy = GF_SystemAction & {
//     type: "systemAction_buy";
// }

// export type GF_SystemAction_Heal = GF_SystemAction & {
//     type: "systemAction_heal";
// }


export type GF_EX_GameData = Record<string, unknown>



// export type GF_SystemAction_Offensive_List = GF_SystemAction_Offensive | GF_SystemAction_Attack;





//!!! 旧仕様
// export type GF_SystemAction_Offensive<EX_Card extends GF_EX_GameData = {}> = {
//     src: GF_Player;
//     target: GF_Player;
//     isMiss: boolean;

//     data: GF_CardMixData_Offensive<EX_Card>;
// }


export type GF_SystemAction_Offensive<EX_Card extends GF_EX_GameData = {}> = {
    src: GF_Player<EX_Card>;
    target: GF_Player<EX_Card>;
    isMiss: boolean;

    data: GF_CardMixData_Attack<EX_Card>;
}

export type GF_SystemAction<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Attack<EX_Card> & {
    src: GF_Player<EX_Card>;
    target: GF_Player<EX_Card>;
    isMiss: boolean;
};
