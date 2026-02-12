export const VERSION = "0.1.1";

type Operations = '===' | '!==' | '>' | '>=' | '<' | '<=';

export function VERSION_COMPARISON(v1: string, operations: Operations, v2: string): boolean {
    const parseVersion = (v: string) => v.split('.').map(num => parseInt(num, 10));
    const [major1, minor1, patch1] = parseVersion(v1);
    const [major2, minor2, patch2] = parseVersion(v2);

    if (
        major1 === undefined || minor1 === undefined || patch1 === undefined ||
        major2 === undefined || minor2 === undefined || patch2 === undefined
    ) return false;

    if (major1 !== major2) {
        return COMPARISON(major1, operations, major2);
    }
    if (minor1 !== minor2) {
        return COMPARISON(minor1, operations, minor2);
    }
    return COMPARISON(patch1, operations, patch2);
}




function COMPARISON(v1: number, operations: Operations, v2: number): boolean {
    switch (operations) {
        case '===':
            return v1 === v2;
        case '!==':
            return v1 !== v2;
        case '>':
            return v1 > v2;
        case '>=':
            return v1 >= v2;
        case '<':
            return v1 < v2;
        case '<=':
            return v1 <= v2;
        default:
            throw new Error(`Unsupported operation: ${operations}`);
    }
}