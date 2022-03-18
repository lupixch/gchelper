export function wordValue(word: string) : number {
    let sum = 0;
    word.toUpperCase().split('').forEach(function(alphabet) {
        if (alphabet.search(/[A-Z]/i) != -1) {
            sum += alphabet.charCodeAt(0) - 64;
        }
    });
    return sum;
};

export function reducedSum(value: number) : number {
    if (value == 0) {
        return 0;
    }
    let sum = value % 9;
    if (sum == 0) {
        sum = 9;
    }
    return sum;
}
