import { GF_Error } from "../game/error.js";

export class GF_Player_Error extends GF_Error {}

/**プレイヤーのステータスが不正な場合のエラー */
export class GF_Player_Error_InvalidStats extends GF_Player_Error {}