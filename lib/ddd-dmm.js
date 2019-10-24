// convert a float value dd.ddd into a string "dd mm.DDD"
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

// Convert a string value "dd mm.DDD" into a float value dd.ddd
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