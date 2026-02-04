export class GF_Error extends Error {}

/**未定義の一時的なエラー */
export class GF_Error_Undefined extends GF_Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(`!!!未定義のエラーが発生しました: ${message ?? ""}`, options);
    }
}