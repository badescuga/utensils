var Value = Utensils.Value;

describe('Value', function() {

  describe('#valueOf', function() {

    it('returns the correct value', function() {
      var value1 = new Value(2);
      expect(value1.valueOf()).to.equal(2);
    });

  });

  describe('#isEqualTo', function() {

    it('returns true if values are equal', function() {
      var value1 = new Value(2);
      var value2 = new Value(2);
      expect(value1.isEqualTo( value2 )).to.be.true;
      expect(Value.isEqualTo( value1, value2 )).to.be.true;
    });

    it('returns false if values are not equal', function() {
      var value1 = new Value(2);
      var value2 = new Value(3);
      expect(value1.isEqualTo( value2 )).to.be.false;
      expect(Value.isEqualTo( value1, value2 )).to.be.false;
    });

  });

  describe('#isNotEqualTo', function() {

    it('returns true if values are equal', function() {
      var value1 = new Value(2);
      var value2 = new Value(2);
      expect(value1.isNotEqualTo( value2 )).to.be.false;
      expect(Value.isNotEqualTo( value1, value2 )).to.be.false;
    });

    it('returns false if values are not equal', function() {
      var value1 = new Value(2);
      var value2 = new Value(3);
      expect(value1.isNotEqualTo( value2 )).to.be.true;
      expect(Value.isNotEqualTo( value1, value2 )).to.be.true;
    });

  });

});
