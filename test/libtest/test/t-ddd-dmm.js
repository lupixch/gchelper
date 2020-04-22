const basedir = '../../..';
const ddmm = require(basedir + '/lib/ddd-dmm.js');


let chai = require('chai');
let expect = chai.expect;

let assert = require('assert');

describe('ddd2dmm()', function() {
    it('should return correct value for 0', function() {
        expect(ddmm.ddd2dmm(0)).to.equal('0 0.000');
    });
    it('should return correct value for 12.5', function() {
        expect(ddmm.ddd2dmm(12.5)).to.equal('12 30.000');
    });
    it('should return correct value for -12.5', function() {
        expect(ddmm.ddd2dmm(-12.5)).to.equal('12 30.000');
    });
    it('should return correct value for 12.505', function() {
        expect(ddmm.ddd2dmm(-12.505)).to.equal('12 30.300');
    });
});


describe('dmm2ddd()', function() {
    it('should return correct value for 0', function() {
        expect(ddmm.dmm2ddd('0 0.000')).to.equal(0);
    });
    it('should return correct value for 12 30.000', function() {
        expect(ddmm.dmm2ddd('12 30.000')).to.equal(12.5);
    });
    it('should return correct value for 12 30.300', function() {
        expect(ddmm.dmm2ddd('12 30.300')).to.equal(12.505);
    });
    it('should return correct value for 12    30.300', function() {
        expect(ddmm.dmm2ddd('12    30.300')).to.equal(12.505);
    });
    it('should return correct value for "   12    30.300  "', function() {
        expect(ddmm.dmm2ddd('   12    30.300   ')).to.equal(12.505);
    });
});