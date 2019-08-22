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

let ddd2dmm = function(ddd) {
    var valDeg, valMin, valSec, result;

    ddd = Math.abs(ddd);

    valDeg = Math.floor(ddd);
    result = valDeg + "  ";

    valMin = (ddd - valDeg) * 60;
    precision = valMin >= 10 ? 5 : 4;
    result = result + valMin.toPrecision(precision);
    return result;
}

let dmm2ddd = function(dmm) {
    var valDeg, valMin, valSec, result;

    let coord = dmm.split(' ');

    let ddd = parseFloat(coord[0]) + (coord[1] / 60);
    return ddd;
}

module.exports = {
    ddd2dmm: ddd2dmm,
    dmm2ddd: dmm2ddd
};