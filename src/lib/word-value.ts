let wordValue = function(word: string) : number {
    let sum = 0;
    word.toUpperCase().split('').forEach(function(alphabet) {
        if (alphabet.search(/[A-Z]/i) != -1) {
            sum += alphabet.charCodeAt(0) - 64;
        }
    });
    return sum;
};

let reducedSum = function(value: number) : number {
    return value % 9;
}

module.exports = {
    wordValue : wordValue,
    reducedSum : reducedSum
};
