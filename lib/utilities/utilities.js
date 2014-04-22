var _ = require('underscore');

// assign instance properties to an object using the arguments
// array and argument names from the function definition.
exports.assignArgumentsAsProperties = function( fn, args ) {
  var getParamNames = function( fn ) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
    if(result === null)
      result = [];
    return result;
  }
  var self = this;
  var argumentNames = argumentKeys = getParamNames( fn );

  var hasNoArguments = function() {
    return argumentNames.length === 0;
  }

  // if an object is passed in as an argument
  // and the target function
  if ( hasNoArguments() && _.isObject( args ) ) {
    argumentKeys = _.keys( args[0] );
    args = args[0];
  };

  _.each( argumentKeys, function( argumentKey, index ) {
    self[ argumentKey ] = args[ hasNoArguments() ? argumentKey : index ];
  })
}

// ripped off wholesale from backbone.js
exports.extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  _.extend(child, parent, staticProps);

  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  if (protoProps) _.extend(child.prototype, protoProps);

  child.__super__ = parent.prototype;

  return child;
};