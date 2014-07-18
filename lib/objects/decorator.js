var Base = require('./base');
var Q = require('q');
var _ = require('underscore');
var utilities = require('../utilities/utilities')

var Decorator = Base.extend({

  constructor: function( obj ) {
    if ( arguments.length === 0 ) return;

    var self = this;
    var sequence = self.returnSequence.bind( self )();
    var methodToDecorate = obj[ this.methodToDecorate ].bind( obj );
    var decoratedMethod = function() {
      return Q.when( methodToDecorate() )
        .then( sequence )
    };
    obj[ this.methodToDecorate ] = decoratedMethod;

    return obj;
  },

  returnSequence: function() {
    var self = this;

    // if only one method is defined on the prototype
    // use that for the procedure, meaning this.procedure
    // doesn't need to be described with just one value
    if ( !this.procedure ) {
      var protoPropProcedureMethods = _.functions( this.constructor.__protoProps__ );
      if ( protoPropProcedureMethods.length === 1 ) 
        this.procedure = protoPropProcedureMethods;
    }

    var procedureMethods = this.prepareProcedureMethods( this.procedure, { 
      firstMethodTakesArgument: true 
    });

    return function() {
      var args = [ procedureMethods ].concat( _.toArray( arguments ) );
      return Q.sequence.apply( null, args );
    };
  }

});

module.exports = Decorator;
