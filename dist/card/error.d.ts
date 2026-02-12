import { GF_Error } from "../game/error.js";
export declare class GF_CardError extends GF_Error {
}
export declare class GF_CardError_NoComponent extends GF_CardError {
}
/**攻撃コンポーネントが存在しない場合のエラー */
export declare class GF_CardError_NoOffensiveComponent extends GF_CardError_NoComponent {
}
/**防御コンポーネントが存在しない場合のエラー */
export declare class GF_CardError_NoDefensiveComponent extends GF_CardError_NoComponent {
}
/**コンポーネントの内容が矛盾している場合のエラー */
export declare class GF_CardError_ComponentConflict extends GF_CardError {
}
/**複数枚同時使用が必須のエラー */
export declare class GF_CardError_MultiUseRequired extends GF_CardError {
}
