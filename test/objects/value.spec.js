var Value;
var value1;
var value2;
var spy;

describe('Value', function() {

  before( function() {
    Value = require('../../lib/utensils').Value;
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

  describe('#isGreaterThan', function() {

    it('returns true if value is greater than other value', function() {
      value2 = new Value(1);
      expect(value1.isGreaterThan( value2 )).to.be.true;
    });

    it('returns false if value is not greater than other value', function() {
      value2 = new Value(3);
      expect(value1.isGreaterThan( value2 )).to.be.false;
    });

  });

  describe('#isLessThan', function() {

    it('returns true if value is less than other value', function() {
      value2 = new Value(3);
      expect(value1.isLessThan( value2 )).to.be.true;
    });

    it('returns false if value is not less than other value', function() {
      value2 = new Value(1);
      expect(value1.isLessThan( value2 )).to.be.false;
    });

  });

});

describe('#parse', function() {

  before( function() {
    Value = require('../../lib/utensils').Value;
    Value = Value.extend({
      parse: function( value ) {
        return value - 1;
      }
    });
    spy = sinon.spy( Value.prototype, 'parse' );
    value1 = new Value(2);
  });

  it('calls parse', function() {
    expect( spy ).to.have.been.calledOnce;
  });

  it('creates a new instance of Value', function() {
    expect( value1 ).to.be.an.instanceOf( Value );
  });

  it('sets the modified value', function() {
    expect( value1.value ).to.equal(1);
  });

});