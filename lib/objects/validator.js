var _ = require('underscore');
var Q = require('q');
var Base = require('./base');
var utilities = require('../utilities/utilities');

var Validator = Base.extend({

  argumentNames: ['data'],

  // map #run for expressive API
  validate: function() {
    return this.run.apply( this, arguments );
  },

  run: function() {
    // returns an object of all functions defined on the 
    // implementation of the Validator constructor
    // or, rather, is the object passed into Validator.extend
    var self = this;

    this.procedure = _.values( this.constructor.__protoProps__ );
    var procedureMethods = utilities.wrapAnySyncFunctionsWithBooleanPromiseHandling( this.procedure );
    var wrappedProcedureMethods = utilities.wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, { preventResultChaining: true, wrapAll: true });
    var boundProcedureMethods = utilities.returnBoundObjectMethods( wrappedProcedureMethods, this );

    // call all methods simultaneously, returning
    // all results
    return Q.allSettled( utilities.returnArrayOfResultsFromExecutedFunctions( boundProcedureMethods ) )
      .then( this.parseResults );
  },

  parseResults: function( results ) {
    var firstResult = results[0]
    console.log( 'results', results );
    return;
  }

});

module.exports = Validator;
