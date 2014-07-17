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

    var procedureMethods = this.prepareMethods( _.keys( this.constructor.__protoProps__ ) );

    // call all methods simultaneously, returning
    // all results
    var procedureMethodPromises = utilities.returnArrayOfResultsFromExecutedFunctions( procedureMethods );
    return Q.allSettled( procedureMethodPromises )
      .then( this.parseResults );
  },

  prepareProcedureMethods: function( procedureMethodKeys ) {
    var procedureMethods;

    procedureMethods = utilities.getObjectMethodsByName( procedureMethodKeys, this );
    procedureMethods = utilities.wrapAnySyncFunctionsWithBooleanPromiseHandling( procedureMethods, this );
    procedureMethods = utilities.wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, this, { 
      sequence: false, 
      wrapAll: true,
      reject: function( fn, reject ) {
        return function( error ) {
          return reject({ name: fn._name, error: error });
        }
      }
    });
    procedureMethods = utilities.returnBoundObjectMethods( procedureMethods, this );

    return procedureMethods;
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
