const basedir = '../../..';
const cl = require(basedir + '/lib/coordlib.js');


let chai = require('chai');
let expect = chai.expect;

let assert = require('assert');

let p1 = {
    latitude: 47.1234,
    longitude: 8.4567
};

let p2 = {
    latitude: 47.1235,
    longitude: 8.4568
};


describe('distance()', function() {
    it('should return 0 for 2 equal points', function() {
        expect(cl.distance(p1, p1)).to.equal(0);
    });
    it('should return correct value for 2 different points', function() {
        expect(cl.distance(p1, p2)).to.equal(13);
    });
});

describe('bearing()', function() {
    it('should return 0 for 2 equal points', function() {
        expect(cl.distance(p1, p1)).to.equal(0);
    });
});

describe('distanceAndBearing()', function() {
    it('should return 0 for 2 equal points', function() {
        expect(cl.distanceAndBearing(p1, p1).distance).to.equal(0);
        expect(cl.distanceAndBearing(p1, p1).bearing).to.equal(0);
    });
    it('should return correct value for 2 different points', function() {
        expect(cl.distanceAndBearing(p1, p2).distance).to.equal(13);
        expect(Math.round(cl.distanceAndBearing(p1, p2).bearing)).to.equal(34);
    });
});

describe('projection()', function() {
    it('should return 0 FAKE', function() {
        expect(cl.projection(p1, 0, 0)).to.be.an('object');
    });
});