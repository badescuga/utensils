var Base = require('./base');
var Q = require('q');
var _ = require('underscore');

var Service = Base.extend({

  run: function() {
    var self = this;
    
    this.procedure = _.chain(this.procedure)
      .compact()
      .map(function(fn) {
        return _.bind( fn, self );
      })
      .value();

    return Q.sequence( this.procedure );
  }

});

module.exports = Service;