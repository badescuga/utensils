var _ = require('underscore');

var getParamNames = function( fn ) {
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  if(result === null)
    result = [];
  return result;
}

var scopeArguments = function( fn, args ) {
  var self = this;
  var argumentNames = getParamNames( fn );
  _.each( argumentNames, function( argumentName, index ) {
    self[ argumentName ] = args[ index ];
  })
}

// ripped off wholesale from Backbone
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