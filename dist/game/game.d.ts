import { GF_Card, type GF_CardUseOptions } from "../card/card";
import type { GF_Card_ID, GF_CardComponent } from "../card/component";
import { GF_Player } from "../player/player";
import type { GF_EX_GameData, GF_SystemAction } from "./action";
import type { GF_SystemEventMap } from "./events/index";
export declare class GF_Game<EX_Card extends GF_EX_GameData = {}, EX_Meta extends GF_EX_GameData = {}> {
    #private;
    /**
     * 現在の攻撃アクションを取得します。\
     * 入力するプレイヤーが攻撃フェーズの場合は null になります。
     */
    get currentAction(): GF_SystemAction<EX_Card> | null;
    get currentPlayer(): GF_Player<EX_Card> | undefined;
    getPlayer(index: number): GF_Player<EX_Card> | undefined;
    get currentPlayerIndex(): number;
    get playerCount(): number;
    getPlayerIndex(player: GF_Player<EX_Card>): number;
    get winner(): GF_Player<EX_Card> | undefined;
    constructor(initialData: GF_Initial_Game<EX_Card, EX_Meta>, options?: GF_GameOptions);
    reset(playerCount: number): void;
    getPlayerByIndex(index: number): GF_Player<EX_Card> | undefined;
    next(useCards: (GF_Card<EX_Card> | GF_Card_ID)[], targetIndex: number, options?: GF_CardUseOptions): void;
}
export type GF_GameOptions<EX_Card extends GF_EX_GameData = {}> = {
    /**!!!未実装
     * データの受け渡しの際にクローンを作成するかどうか
     */
    secureMode?: boolean;
    events?: GF_GameEvents<EX_Card>;
};
export type GF_GameEvents<EX_Card extends GF_EX_GameData = {}> = {
    [key in keyof GF_SystemEventMap<EX_Card>]?: (ev: GF_SystemEventMap<EX_Card>[key]) => void;
};
export type GF_Initial_Game<EX_Card extends GF_EX_GameData = {}, EX_Meta extends GF_EX_GameData = {}> = {
    cards: GF_CardComponent<EX_Card>[];
    meta?: EX_Meta;
};
