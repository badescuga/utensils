var utilities = require('../utilities/utilities');
var _ = require('underscore');

var Base = function() {
  var self = this;
  
  // attach raw arguments to this
  this.arguments = _.toArray( arguments );
  
  // attach arguments to this with names
  if ( this.argumentNames ) {
    var argumentName;
    _.each( this.arguments, function(a, index) {
      self[self.argumentNames[index]] = a;
    });
  }
}

Base.extend = utilities.extend;

Base.prototype.new = function(){
  var args = arguments;
  var constructor = this;
  function This() {
    constructor.apply(this, args);
  };
  This.prototype = constructor.prototype;
  return new This;
};

module.exports = Base;