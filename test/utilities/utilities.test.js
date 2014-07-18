var utilities = require('../../lib/utilities/utilities');

describe('utilities', function() {

  var Person;
  var Parent;
  var parent;

  describe('#extend', function() {

    before( function() {
      Person = function() {};
      Person.prototype.isHuman = function() { return true; };
      Person.prototype.isParent = function() { return false; };
      Person.create = function() { return true; };
      Person.extend = utilities.extend;

      Parent = Person.extend({
        isParent: function() { return true; },
        isGoodParent: true
      }, {
        create: function() { return false; },
        destroy: function() {}
      })

      parent = new Parent();
    });

    it('inherits all prototype properties', function() {
      expect(parent.isHuman).to.be.a('function');
    });

    it('overwrites parent prototype properties of same name', function() {
      expect(parent.isParent()).to.be.true;
    });

    it('builds all new prototype properties', function() {
      expect(parent.isGoodParent).to.be.true;
    });

    it('inherits all static properties', function() {
      expect(Parent.create).to.be.a('function');
    });

    it('overwrites parent static properties of same name', function() {
      expect(Person.create()).to.be.true;
      expect(Parent.create()).to.be.false;
    });

    it('builds all new static properties', function() {
      expect(Parent.destroy).to.be.a('function');
    });

  });

});