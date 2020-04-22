const basedir = '../../..';
const wv = require(basedir + '/lib/word-value.js');


let chai = require('chai');
let expect = chai.expect;

let assert = require('assert');

describe('wordValue()', function() {
    it('should return 0 for no word', function() {
      expect(wv.wordValue('')).to.equal(0);
    });
    it('should return a correct value for a single word', function() {
      expect(wv.wordValue('apple')).to.equal(50);
    });
    it('should return a correct value for a splitted word', function() {
      expect(wv.wordValue('app le')).to.equal(50);
    });
});

describe('reducedSum()', function() {
    it('should return the correct value for a 0', function() {
      expect(wv.reducedSum(0)).to.equal(0);
    });
     it('should return the correct value for a single digit', function() {
      expect(wv.reducedSum(7)).to.equal(7);
    });
    it('should return the correct value for a double digit', function() {
      expect(wv.reducedSum(77)).to.equal(5);
    });
    it('should return the correct value for a double digit', function() {
      expect(wv.reducedSum(34)).to.equal(7);
    });
});

