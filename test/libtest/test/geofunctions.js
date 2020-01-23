const basedir = '../../..';
//const wv = require(basedir + '/lib/word-value.js');
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

describe('distance()', function() {
    it('should return 0 for no bearing', function() {
        expect(geo.getRhumbLineBearing(p1, p1) == 0);
    });
    it('should return correct value for real bearing', function() {
        // console.log("bearing: ", geo.getRhumbLineBearing(p1, p2));
        expect(Math.round(geo.getRhumbLineBearing(p1, p2))).to.equal(34);
    });
});