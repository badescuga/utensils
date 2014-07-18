var utilities = require('../utilities/utilities');
var Base = require('./base');

var Value = Base.extend({

  argumentName: 'value',

  valueOf: function() {
    return this[ this.argumentName ];
  }

});

function isEqualTo( a, b ) {
  return a.valueOf() === b.valueOf();
};

function isNotEqualTo( a, b ) {
  return a.valueOf() !== b.valueOf();
};

utilities.attachFunctionsToConstructorAndPrototye( Value, [isEqualTo, isNotEqualTo]);

module.exports = Value;
