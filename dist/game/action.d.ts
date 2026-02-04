import type { GF_CardMixData_Attack } from "../card/card";
import { GF_Player } from "../player/player";
export type GF_EX_GameData = Record<string, unknown>;
export type GF_SystemAction_Offensive<EX_Card extends GF_EX_GameData = {}> = {
    src: GF_Player<EX_Card>;
    target: GF_Player<EX_Card>;
    isMiss: boolean;
    data: GF_CardMixData_Attack<EX_Card>;
};
export type GF_SystemAction<EX_Card extends GF_EX_GameData = {}> = GF_CardMixData_Attack<EX_Card> & {
    src: GF_Player<EX_Card>;
    target: GF_Player<EX_Card>;
    isMiss: boolean;
};
