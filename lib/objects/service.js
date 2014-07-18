var Base = require('./base');
var Q = require('q');
var _ = require('underscore');
var utilities = require('../utilities/utilities')

var Service = Base.extend({

  constructor: function() {
    Base.prototype.constructor.apply( this, arguments );

    // if only one method is defined on the prototype
    // use that for the procedure, meaning this.procedure
    // doesn't need to be described with just one value
    var protoPropProcedureMethods = _.functions( this.constructor.__protoProps__ );
    if ( protoPropProcedureMethods.length === 1 ) {
      this.procedure = protoPropProcedureMethods;
    }

    this.procedureMethods = this.prepareProcedureMethods( this.procedure );
  },

  run: function() {
    var self = this;

    return Q.sequence( this.procedureMethods )
      .then(this.success)
      .fail(this.error);
  }

});

module.exports = Service;