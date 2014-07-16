var _ = require('underscore');
var Q = require('q');
var Base = require('./base');
var utilities = require('../utilities/utilities');

var Form = Base.extend({

  argumentNames: ['data'],

  // map #run for expressive API
  process: function() {
    return this.run.apply( this, arguments );
  },

  procedure: [
    'validate',
    'persist'
  ],

  run: function() {
    var self = this;

    if ( this.validator ) {
      this.validate = function() {
        return new self.validator( self.data ).run();
      }
    }

    if ( this.persistor ) {
      this.persist = function() {
        return new self.persistor( self.data ).run();
      }
    }
    
    // if a procedure stack has been defined custom, get the methods based on the string names
    // otherwise, use the default stack of #validate and #persist
    var procedureMethods = utilities.getObjectMethodsByName( this.procedure, this );
    var wrappedProcedureMethods = utilities.wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods );
    var boundProcedureMethods = utilities.returnBoundObjectMethods( wrappedProcedureMethods, this );

    return Q.sequence( boundProcedureMethods )
      .then(this.success)
      .fail(this.error);
  }

});

module.exports = Form;