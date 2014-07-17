var Base = require('./base');
var Q = require('q');
var _ = require('underscore');
var utilities = require('../utilities/utilities')

var Service = Base.extend({

  run: function() {
    var self = this;

    var procedureMethods = this.prepareProcedureMethods( this.procedure );

    return Q.sequence( procedureMethods )
      .then(this.success)
      .fail(this.error);
  }

});

module.exports = Service;