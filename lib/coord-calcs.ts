/**
 * Interface layer between application and geolib that
 * provides functions to make calculations with coordinats.
 * It always uses the the standard format dd.ddddd
 */

const geo = require('geolib');
import { Point } from './point';

interface DistanceBearing {
    distance: number;
    bearing: number;
}

class CoordException {
    message: string;
    name: string;

    constructor(message: string) {
        this.message = message;
        this.name = "CoordException";
    }
}

let pointIsValid = function (p: Point): boolean {
    if (p === undefined) return false;
    if (p.latitude === undefined) return false;
    if (p.longitude === undefined) return false;
    if (p.latitude < -90) return false;
    if (p.latitude > 90) return false;
    if (p.longitude < -180) return false;
    if (p.longitude > 180) return false;
    return true;
}

let distanceIsValid = function (distance: number): boolean {
    // Actually there seems to be no invalid velue for distances.
    return true;
}

let bearingIsValid = function (bearing: number): boolean {
    if (bearing < 0) return false;
    if (bearing > 360) return false;
    return true;
}

let distance = function (p1: Point, p2: Point): number {
    if (!pointIsValid(p1)) throw new CoordException('P1 is invalid.');
    if (!pointIsValid(p2)) throw new CoordException('P2 is invalid.');
    return geo.getDistance(p1, p2);
}

let bearing = function (p1: Point, p2: Point): number {
    if (!pointIsValid(p1)) throw new CoordException('P1 is invalid.');
    if (!pointIsValid(p2)) throw new CoordException('P2 is invalid.');
    return geo.getRhumbLineBearing(p1, p2);
}

let distanceAndBearing = function (p1: Point, p2: Point): DistanceBearing {
    if (!pointIsValid(p1)) throw new CoordException('P1 is invalid.');
    if (!pointIsValid(p2)) throw new CoordException('P2 is invalid.');
    let db: DistanceBearing = {
        distance: 0,
        bearing: 0
    }
    db.distance = geo.getDistance(p1, p2);
    db.bearing = geo.getRhumbLineBearing(p1, p2);
    return db;
}

let projection = function (point: Point, distance: number, bearing: number): Point {
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