var _ = require('underscore');
var Q = require('q');
var Base = require('./base');
var utilities = require('../utilities/utilities');

var Policy = Base.extend({

  // map #run for expressive API
  analyze: function() {
    return this.run.apply( this, arguments );
  },

  run: function() {
    // returns an object of all functions defined on the 
    // implementation of the Validator constructor
    // or, rather, is the object passed into Validator.extend
    var self = this;

    var procedureMethods = this.prepareProcedureMethods( _.functions( this.constructor.__protoProps__ ), { 
      context: _.pick.call( null, this, this.argumentNames )
    });

    // call all methods simultaneously, returning
    // all results
    var procedureMethodPromises = utilities.returnArrayOfResultsFromExecutedFunctions( procedureMethods );
    return Q.allSettled( procedureMethodPromises )
      .then( this.parseResults );
  },

  prepareProcedureMethods: function( procedureMethodKeys, options ) {
    options = ( options || {} );
    var procedureMethods;

    procedureMethods = utilities.getObjectMethodsByName( procedureMethodKeys, this );
    procedureMethods = utilities.wrapAnySyncFunctionsWithBooleanPromiseHandling( procedureMethods, options.context || this, options );
    procedureMethods = utilities.wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, options.context || this, { 
      sequence: false, 
      reject: function( fn, reject ) {
        return function( error ) {
          return reject({ name: fn._name, error: error });
        }
      }
    });
    procedureMethods = utilities.returnBoundObjectMethods( procedureMethods, options.context || this );

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
      deferred.resolve( this.arguments );
    }

    return deferred.promise;
  }

});

module.exports = Policy;
