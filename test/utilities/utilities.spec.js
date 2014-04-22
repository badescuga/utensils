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

  describe('#assignArgumentsAsProperties', function() {

    var Person;
    var person;

    describe('arguments separated', function() {

      before( function() {
        Person = function() {
          utilities.assignArgumentsAsProperties.call( this, this.run, arguments );
          return this.run();
        };
        Person.prototype.run = function( age, name, gender ) {};
        person = new Person( 27, 'Michael Phillips', 'm' );
      });

      it('scopes all values of the arguments to this', function() {
        expect(person.age).to.equal(27)
      });

    });

    describe('arguments as object', function() {

      before( function() {
        Person = function() {
          utilities.assignArgumentsAsProperties.call( this, this.run, arguments );
          return this.run();
        };
        Person.prototype.run = function() {};
        person = new Person({ age: 27, name: 'Michael Phillips', gender: 'm' });
      });

      it('scopes all values of the arguments to this', function() {
        expect(person.age).to.equal(27)
      });

    });

  });

});