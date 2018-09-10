let wordValue = function(word) {
    let sum = 0;
    word.toUpperCase().split('').forEach(function(alphabet) {
        if (alphabet.search(/[A-Z]/i) != -1) {
            sum += alphabet.charCodeAt(0) - 64;
        }
    });
    //console.log(sum); 
    return sum;
};

reducedSum = function(value) {
//    return value < 10 ? value : value % 9;
    return value % 9;
}

module.exports = {
    wordValue : wordValue,
    reducedSum : reducedSum
};
