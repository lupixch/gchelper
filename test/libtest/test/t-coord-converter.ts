const basedir = '../../..';
const Cc = require(basedir + '/lib/coord-converter.js').CoordConverter;
// const Format : Format = require(basedir + '/lib/coord-converter').Format;
import { Format} from '../../../lib/coord-converter';
import { Point } from '../../../lib/point';

let chai = require('chai');
let expect = chai.expect;

let p1 : Point = {
    latitude: 47.1234,
    longitude: 8.4567
};

// TODO: spacing in coords should be aligned with converter options
let p1Swiss1903 : string = '677251 219658';
let p1WGS84_ddmmss : string = 'N47 7 24.240 E8 27 24.120';
let p1WGS84_ddmmddd : string = 'N47 7.404 E8 27.402';
let p1WGS84_dd : string = 'N47.123400 E8.456700';


let trimSpaces = function(str : string) : string {
    return str.replace(/\s\s+/g, ' ');
}

describe('Constructor', function() {
    it(' leads to standard format', function() {
        let cc = new Cc();
        let format = cc.getFormat();
        expect(format).to.equal(Format.WGS84_ddmmddd);
    });
});

describe('Set and get of format type', function() {
    it('changes and returns the correct type', function() {
        let cc = new Cc();
        let format = cc.getFormat();
        expect(format).to.equal(Format.WGS84_ddmmddd);
        cc.setFormat(Format.WGS84_ddmmss);
        format = cc.getFormat();
        expect(format).to.equal(Format.WGS84_ddmmss);
        cc.setFormat(Format.Swissgrid1903);
        format = cc.getFormat();
        expect(format).to.equal(Format.Swissgrid1903);
    });
});


describe('Conversion type "WGS84 dd"', function() {
    it('converts a string to a point', function() {
        let cc = new Cc();
        cc.setFormat(Format.WGS84_dd);
        let p : Point = cc.asPoint(p1WGS84_ddmmddd);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);
    });
    it('converts a point to a string', function() {
        let cc = new Cc();
        cc.setFormat(Format.WGS84_dd);
        expect(trimSpaces(cc.asString(p1))).to.equal(p1WGS84_dd);
    });
});

describe('Conversion type "WGS84 dd mm.ddd"', function() {
    it('converts a string to a point', function() {
        let cc = new Cc();
        cc.setFormat(Format.WGS84_ddmmddd);
        let p : Point = cc.asPoint(p1WGS84_ddmmddd);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);
    });
    it('converts a point to a string', function() {
        let cc = new Cc();
        cc.setFormat(Format.WGS84_ddmmddd);
        expect(trimSpaces(cc.asString(p1))).to.equal(p1WGS84_ddmmddd);
    });
});

describe('Conversion type "WGS84 dd mm ss"', function() {
    it('converts a string to a point', function() {
        let cc = new Cc();
        cc.setFormat(Format.WGS84_ddmmss);
        let p : Point = cc.asPoint(p1WGS84_ddmmss);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);
    });
    it('converts a point to a string', function() {
        let cc = new Cc();
        cc.setFormat(Format.WGS84_ddmmss);
        expect(trimSpaces(cc.asString(p1))).to.equal(p1WGS84_ddmmss);
    });
});

describe('Conversion type "Swissgrid 1903"', function() {
    it('converts a string to a point', function() {
        let cc = new Cc();
        cc.setFormat(Format.Swissgrid1903);
        let p : Point = cc.asPoint(p1Swiss1903);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);
    });
    it('converts a point to a string', function() {
        let cc = new Cc();
        cc.setFormat(Format.Swissgrid1903);
        expect(trimSpaces(cc.asString(p1))).to.equal(p1Swiss1903);
    });
});

describe('Conversion chain"', function() {
    it('changes of format works correct for a chain of conversion', function() {
        let cc = new Cc();
        cc.setFormat(Format.WGS84_dd);
        let str = cc.asString(p1);
        let p : Point = cc.asPoint(str);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);

        cc.setFormat(Format.WGS84_ddmmss);
        str = cc.asString(p);
        p = cc.asPoint(str);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);

        cc.setFormat(Format.WGS84_ddmmddd);
        str = cc.asString(p);
        p = cc.asPoint(str);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);

        cc.setFormat(Format.Swissgrid1903);
        str = cc.asString(p);
        p = cc.asPoint(str);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);

        cc.setFormat(Format.WGS84_dd);
        str = cc.asString(p);
        p = cc.asPoint(str);
        expect(p.latitude).to.be.closeTo(p1.latitude, 0.001);
        expect(p.longitude).to.be.closeTo(p1.longitude, 0.001);

    });
});
