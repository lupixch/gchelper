/**
 * Interface layer between application and geolib
 */

const geo = require('geolib');

function CoordException(message) {
    this.message = message;
    this.name = "CoordException";
}

let pointIsValid = function (p) {
    if (p === undefined) return false;
    if (p.latitude === undefined) return false;
    if (p.longitude === undefined) return false;
    if (p.latitude < -90) return false;
    if (p.latitude > 90) return false;
    if (p.longitude < -180) return false;
    if (p.longitude > 180) return false;
    return true;
}

let distanceIsValid = function (distance) {
    // Actually there seems to be no invalid velue for distances.
    return true;
}

let bearingIsValid = function (bearing) {
    if (bearing < 0) return false;
    if (bearing > 360) return false;
    return true;
}

let distance = function (p1, p2) {
    if (!pointIsValid(p1)) throw new CoordException('P1 is invalid.');
    if (!pointIsValid(p2)) throw new CoordException('P2 is invalid.');
    return geo.getDistance(p1, p2);
}

let bearing = function (p1, p2) {
    if (!pointIsValid(p1)) throw new CoordException('P1 is invalid.');
    if (!pointIsValid(p2)) throw new CoordException('P2 is invalid.');
    return geo.getRhumbLineBearing(p1, p2);
}

let distanceAndBearing = function (p1, p2) {
    if (!pointIsValid(p1)) throw new CoordException('P1 is invalid.');
    if (!pointIsValid(p2)) throw new CoordException('P2 is invalid.');
    let db = {
        distance: 0,
        bearing: 0
    }
    db.distance = geo.getDistance(p1, p2);
    db.bearing = geo.getRhumbLineBearing(p1, p2);
    return db;
}

let projection = function (point, distance, bearing) {
    if (!pointIsValid(point)) throw new CoordException('P1 is invalid.');
    if (!distanceIsValid(distance)) throw new CoordException('Distance is invalid.');
    if (!bearingIsValid(bearing)) throw new CoordException('Bearing is invalid.');
    return geo.computeDestinationPoint(point, distance, bearing);
}

module.exports = {
    distance: distance,
    bearing: bearing,
    distanceAndBearing: distanceAndBearing,
    projection: projection,
    pointIsValid: pointIsValid,
    distanceIsValid: distanceIsValid, 
    bearingIsValid: bearingIsValid
};