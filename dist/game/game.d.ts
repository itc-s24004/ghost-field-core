import { GF_Card } from "../card/card.js";
import type { GF_Card_ID, GF_CardComponent } from "../card/component.js";
import { CategoryEventEmitter } from "../emitter/emitter.js";
import { GF_Player } from "../player/player.js";
import { GF_CardUseOptions } from "../util/card/index.js";
import type { GF_EX_GameData, GF_SystemAction } from "./action.js";
import type { GF_GameEventMap, GF_SystemEventDataMap } from "./events/index.js";
export declare class GF_Game<EX_Card extends GF_EX_GameData = {}, EX_Meta extends GF_EX_GameData = {}, Category extends string = string> extends CategoryEventEmitter<GF_SystemEventDataMap<EX_Card>, Category> {
    #private;
    /**
     * 現在の攻撃アクションを取得します。\
     * 入力するプレイヤーが攻撃フェーズの場合は undefined になります。
     */
    get currentAction(): GF_SystemAction<EX_Card> | undefined;
    get allPlayers(): GF_Player<EX_Card>[];
    get currentPlayer(): GF_Player<EX_Card> | undefined;
    getPlayer(index: number): GF_Player<EX_Card> | undefined;
    get currentPlayerIndex(): number;
    get playerCount(): number;
    getPlayerIndex(player: GF_Player<EX_Card>): number;
    get isPlaying(): boolean;
    get winner(): GF_Player<EX_Card> | undefined;
    get initData(): GF_Initial_Game<EX_Card, EX_Meta>;
    constructor(initialData: GF_Initial_Game<EX_Card, EX_Meta>, options?: GF_GameOptions<EX_Card>);
    reset(playerCount: number): void;
    getPlayerByIndex(index: number): GF_Player<EX_Card> | undefined;
    next(useCards: (GF_Card<EX_Card> | GF_Card_ID)[], targetIndex: number, options?: GF_CardUseOptions): void;
    addAction(action: GF_SystemAction<EX_Card>, push?: boolean): void;
    kill(player: GF_Player<EX_Card>): void;
    addDamage(player: GF_Player<EX_Card>, damage: number, damageSource: GF_Player<EX_Card>): void;
    get info(): GF_GameInfo<EX_Card, EX_Meta>;
}
export type GF_GameOptions<EX_Card extends GF_EX_GameData = {}> = {
    /**!!!未実装
     * データの受け渡しの際にクローンを作成するかどうか
     */
    secureMode?: boolean;
    events?: GF_GameEventMap<EX_Card>;
};
export type GF_Initial_Game<EX_Card extends GF_EX_GameData = {}, EX_Meta extends GF_EX_GameData = {}> = {
    cards: GF_CardComponent<EX_Card>[];
    meta: EX_Meta | undefined;
};
export type GF_GameInfo<EX_Card extends GF_EX_GameData, EX_Meta extends GF_EX_GameData> = GF_Initial_Game<EX_Card, EX_Meta> & {
    meta: EX_Meta | undefined;
};
