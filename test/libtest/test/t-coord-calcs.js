const basedir = '../../..';
const cc = require(basedir + '/lib/coord-calcs.js');


let chai = require('chai');
let expect = chai.expect;

let assert = require('assert');

let p1 = {
    latitude: 47.123400,
    longitude: 8.456700
};

let p1north = {
    latitude: 48.123400,
    longitude: 8.456700
};

let p1east = {
    latitude: 47.123400,
    longitude: 9.456700
};

let p1south = {
    latitude: 46.123400,
    longitude: 8.456700
};

let p1west = {
    latitude: 47.123400,
    longitude: 7.456700
};

let p2 = {
    latitude: 47.1235,
    longitude: 8.4568
};


describe('distanceIsValid()', function() {
    it('actually accepts all kind of distances', function() {
        expect(cc.distanceIsValid(0)).to.be.true;
        expect(cc.distanceIsValid(5000)).to.be.true;
        expect(cc.distanceIsValid(-4711)).to.be.true;
    });
});

describe('bearingIsValid()', function() {
    it('accepts valid bearings', function() {
        expect(cc.bearingIsValid(0)).to.be.true;
        expect(cc.bearingIsValid(123)).to.be.true;
        expect(cc.bearingIsValid(360)).to.be.true;
    });
    it('rejects invalid bearings', function() {
        expect(cc.bearingIsValid(-1)).to.be.false;
        expect(cc.bearingIsValid(361)).to.be.false;
    });
});



describe('pointIsValid()', function() {
    it('rejects an undefined point', function() {
        expect(cc.pointIsValid()).to.be.false;
    });
    it('rejects a point with no latitude', function() {
        expect(cc.pointIsValid({longitude:0})).to.be.false;
    });
    it('rejects a point with no longitude', function() {
        expect(cc.pointIsValid({latitude:0})).to.be.false;
    });
    it('rejects a point with invalid latitude', function() {
        expect(cc.pointIsValid({latitude: 91,longitude: 0})).to.be.false;
        expect(cc.pointIsValid({latitude: -91,longitude: 0})).to.be.false;
    });
    it('rejects a point with invalid longitude', function() {
        expect(cc.pointIsValid({latitude: 0, longitude: 181})).to.be.false;
        expect(cc.pointIsValid({latitude: 0, longitude: -181})).to.be.false;
    });
    it('accepts points with valid and limit values', function() {
        expect(cc.pointIsValid({latitude: 0, longitude: 0})).to.be.true;
        expect(cc.pointIsValid({latitude: 47, longitude: 12})).to.be.true;
        expect(cc.pointIsValid({latitude: 90, longitude: 180})).to.be.true;
        expect(cc.pointIsValid({latitude: -90, longitude: -180})).to.be.true;
        expect(cc.pointIsValid({latitude: 90, longitude: -180})).to.be.true;
        expect(cc.pointIsValid({latitude: -90, longitude: 180})).to.be.true;
    });
});

describe('distance()', function() {
    it('should return 0 for 2 equal points', function() {
        expect(cc.distance(p1, p1)).to.equal(0);
    });
    it('should return correct value for 2 different points', function() {
        expect(cc.distance(p1, p2)).to.equal(13);
    });
});

describe('bearing()', function() {
    it('should return 0 for 2 equal points', function() {
        expect(cc.bearing(p1, p1)).to.equal(0);
    });
    it('should return 0 for a north point', function() {
        expect(cc.bearing(p1, p1north)).to.equal(0);
    });
    it('should return 90 for a east point', function() {
        expect(cc.bearing(p1, p1east)).to.equal(90);
    });
    it('should return 180 for a south point', function() {
        expect(cc.bearing(p1, p1south)).to.equal(180);
    });
    it('should return 2700 for a west point', function() {
        expect(cc.bearing(p1, p1west)).to.equal(270);
    });
});

describe('distanceAndBearing()', function() {
    it('should return 0 for 2 equal points', function() {
        expect(cc.distanceAndBearing(p1, p1).distance).to.equal(0);
        expect(cc.distanceAndBearing(p1, p1).bearing).to.equal(0);
    });
    it('should return correct value for 2 different points', function() {
        expect(cc.distanceAndBearing(p1, p2).distance).to.equal(13);
        expect(Math.round(cc.distanceAndBearing(p1, p2).bearing)).to.equal(34);
    });
});

describe('projection()', function() {
    it('with zero distance and angle should return same point', function() {
        let p = cc.projection(p1, 0, 0); 
        expect(p.latitude.toFixed(5)).to.equal(p1.latitude.toFixed(5));
        expect(p.longitude.toFixed(5)).to.equal(p1.longitude.toFixed(5));
    });
});

describe('projection()', function() {
    it('should return correct new point', function() {
        let p = cc.projection(p1, 13, 34); 
        expect(p.latitude.toFixed(5)).to.equal(p2.latitude.toFixed(5));
        expect(p.longitude.toFixed(5)).to.equal(p2.longitude.toFixed(5));
    });
    it('should return correct new point with negative distance', function() {
        let p = cc.projection(p1, -13, 34 + 180); 
        expect(p.latitude.toFixed(5)).to.equal(p2.latitude.toFixed(5));
        expect(p.longitude.toFixed(5)).to.equal(p2.longitude.toFixed(5));
    });
});