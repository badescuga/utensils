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

    this.procedure = utilities.getObjectMethodsByName( _.keys( this.constructor.__protoProps__ ), this );
    var procedureMethods = utilities.wrapAnySyncFunctionsWithBooleanPromiseHandling( this.procedure, this );
    var wrappedProcedureMethods = utilities.wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, this, { 
      preventResultChaining: true, 
      wrapAll: true,
      reject: function( fn, reject ) {
        return function( error ) {
          return reject({ name: fn._name, error: error });
        }
      }
    });
    var boundProcedureMethods = utilities.returnBoundObjectMethods( wrappedProcedureMethods, this );

    // call all methods simultaneously, returning
    // all results
    return Q.allSettled( utilities.returnArrayOfResultsFromExecutedFunctions( boundProcedureMethods ) )
      .then( this.parseResults );
  },

  parseResults: function( results ) {
    var deferred = Q.defer();
    var firstResult = results[0]
    var errors = _.chain(results)
      .filter( function( result ) { return result.state === 'rejected' })
      .map( function( error ) { return error.reason; })
      .value();

    if ( errors.length > 0 ) {
      deferred.reject( errors );
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  }

});

module.exports = Validator;
