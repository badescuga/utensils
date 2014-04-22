var Value;
var value1;
var value2;

describe('Value', function() {

  before( function() {
    Value = require('../../lib/objects/value');
    value1 = new Value(2);
  })

  describe('#value', function() {

    it('returns the correct value', function() {
      expect(value1.value).to.equal(2);
    })

  })

  describe('#isEqualTo', function() {

    it('should be false if values are not equal', function() {
      value2 = new Value(3);
      expect(value1.isEqualTo( value2 )).to.be.false;
    })

    it('should be true if values are equal', function() {
      value2 = new Value(2);
      expect(value1.isEqualTo( value2 )).to.be.true;
    })

  })

})