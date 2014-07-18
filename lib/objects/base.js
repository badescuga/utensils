var utilities = require('../utilities/utilities');
var _ = require('underscore');

var Base = function() {
  var self = this;
  
  // attach raw arguments to this
  if ( this.argumentName )
    this.argumentNames = [ this.argumentName ];

  this.arguments = _.object( this.argumentNames, _.toArray( arguments ));
  Object.freeze( this.arguments );
  
  // attach arguments to this with names
  if ( this.argumentNames ) {
    _.each( _.toArray( arguments ), function(a, index) {
      self[self.argumentNames[index]] = a;
    });
  }
}

Base.extend = utilities.extend;

Function.prototype.new = function(){
  var args = arguments;
  var constructor = this;
  function This() {
    constructor.apply(this, args);
  };
  This.prototype = constructor.prototype;
  return new This;
};

Base.prototype.prepareProcedureMethods = function( procedureMethodKeys, options ) {
  options = ( options || {} );
  var procedureMethods;

  procedureMethods = utilities.getObjectMethodsByName( procedureMethodKeys, this, options );
  procedureMethods = utilities.wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, options.context || this, options );
  procedureMethods = utilities.returnBoundObjectMethods( procedureMethods, options.context || this, options );

  return procedureMethods;
}

module.exports = Base;