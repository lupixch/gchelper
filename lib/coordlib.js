/**
 * Interface layer between application and geolib
 */

const geo = require('geolib');

let checkPointValid = function(p) {
    // TODO: implement me
    return true;
}

let checkDistanceValid = function(distance) {
    // TODO: implement me
    return true;
}

let checkBearingValid = function(bearing) {
    // TODO: implement me
    return true;
}

let distance = function(p1, p2) {
    // TODO: implement me
    return geo.getDistance(p1, p2);
}

let bearing = function(p1, p2) {
    return geo.getRhumbLineBearing(p1, p2);
}

let distanceAndBearing = function(p1, p2) {
    let db = {
        distance: 0,
        bearing: 0
    }
    db.distance = geo.getDistance(p1, p2);
    db.bearing = geo.getRhumbLineBearing(p1, p2);
    return db;
}

let projection = function(point, distance, bearing) {
    return geo.computeDestinationPoint(point, distance, bearing);
}

module.exports = {
    distance: distance,
    bearing: bearing,
    distanceAndBearing: distanceAndBearing,
    projection: projection,
    checkPointValid : checkPointValid
};