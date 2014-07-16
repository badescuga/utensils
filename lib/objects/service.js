var Base = require('./base');
var Q = require('q');
var _ = require('underscore');
var utilities = require('../utilities/utilities')

var Service = Base.extend({

  run: function() {
    var self = this;

    var procedureMethods = utilities.getObjectMethodsByName( this.procedure, this );
    var wrappedProcedureMethods = utilities.wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods );
    var boundProcedureMethods = utilities.returnBoundObjectMethods( wrappedProcedureMethods, this );

    return Q.sequence( boundProcedureMethods )
      .then(this.success)
      .fail(this.error);
  }

});

module.exports = Service;