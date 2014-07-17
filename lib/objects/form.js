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
      this.validate = function( resolve, reject ) {
        return new self.validator( self.data ).run()
          .then( resolve )
          .fail( reject );
      }
    }

    if ( this.persistor ) {
      this.persist = function( resolve, reject ) {
        return new self.persistor( self.data ).run()
          .then( resolve )
          .fail( reject );
      }
    }
    
    var procedureMethods = this.prepareProcedureMethods( this.procedure );

    return Q.sequence( procedureMethods )
      .then(this.success)
      .fail(this.error);
  }

});

module.exports = Form;