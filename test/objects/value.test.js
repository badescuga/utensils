var Value = require('../../lib/utensils').Value;
var value1;
var value2;
var spy;

describe('Value', function() {

  before( function() {
    value1 = new Value(2);
  });

  describe('#value', function() {

    it('returns the correct value', function() {
      expect(value1.value).to.equal(2);
    });

  });

  describe('#isEqualTo', function() {

    it('returns true if values are equal', function() {
      value2 = new Value(2);
      expect(value1.isEqualTo( value2 )).to.be.true;
    });

    it('returns false if values are not equal', function() {
      value2 = new Value(3);
      expect(value1.isEqualTo( value2 )).to.be.false;
    });

  });

  describe('#isNotEqualTo', function() {

    it('returns true if values are not equal', function() {
      value2 = new Value(3);
      expect(value1.isNotEqualTo( value2 )).to.be.true;
    });

    it('returns false if values are equal', function() {
      value2 = new Value(2);
      expect(value1.isNotEqualTo( value2 )).to.be.false;
    });

  });

});
