/**
 * Test helper to check the access to the geolib functions. Not really used for project code.
 */

const basedir = '../../..';
const geo = require('geolib');


let chai = require('chai');
let expect = chai.expect;

let assert = require('assert');

// rle: only the decimal format is really usable. The other supported format "x° y' z''" needs this exactly syntax.
let p1 = {
    latitude: 47.1234,
    longitude: 8.4567
};

let p2 = {
    latitude: 47.1235,
    longitude: 8.4568
};


describe('distance()', function() {
    it('should return 0 for no distance', function() {
        expect(geo.getDistance(p1, p1) == 0);
    });
    it('should return correct value for real distance', function() {
        // console.log("distance: ", geo.getDistance(p1, p2, 1));
        expect(geo.getDistance(p1, p2)).to.equal(13);
    });
});

describe('bearing()', function() {
    it('should return 0 for no bearing', function() {
        expect(geo.getRhumbLineBearing(p1, p1) == 0);
    });
    it('should return correct value for real bearing', function() {
        // console.log("bearing: ", geo.getRhumbLineBearing(p1, p2));
        expect(Math.round(geo.getRhumbLineBearing(p1, p2))).to.equal(34);
    });
});

describe('projection()', function() {
    it('should return same point for no distance and bearing', function() {
        expect(geo.computeDestinationPoint(p1, 0, 0).latitude).to.closeTo(p1.latitude, 0.01);
        expect(geo.computeDestinationPoint(p1, 0, 0).longitude).to.closeTo(p1.longitude, 0.01);
    });
    it('should return correct point for real distance and bearing', function() {
        expect(geo.computeDestinationPoint(p1, 13, 34).latitude).to.be.closeTo(p2.latitude, 0.01);
        expect(geo.computeDestinationPoint(p1, 13, 34).longitude).to.be.closeTo(p2.longitude, 0.01);
    });
});