var _ = require('underscore');
var Q = require('q');

// assign instance properties to an object using the arguments
// array and argument names from the function definition.
function assignArgumentsAsProperties( fn, args ) {
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
};

// ripped off wholesale from backbone.js
function extend(protoProps, staticProps) {
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
  child.__protoProps__ = protoProps;

  return child;
};

// create a copy of the function that
// has the first argument pre-filled, and then
// return the value of that function called with 
// the arguments
function partialApply( fn, context, args ) {
  var fn = _.partial( fn, context ); 
  return fn.apply( context, args );
};

// take each function defined and bind it 
// to both the parent function itself and
// the prototype, with the prototype having
// the first argument pre-filled with `this`
function attachFunctionsToConstructorAndPrototye( Ctor, fns ) {
  _.each(fns, function( fn ) {
    Ctor[fn.name] = fn;
    Ctor.prototype[fn.name] = function() { return exports.partialApply(fn, this, arguments); }  
  });
};

function wrapWithPromise( staticFn, args, context, options ) {
  options = ( options || {} );

  var promiseFn = _.wrap( staticFn, function( fn ) {
    var token = Q.defer();
    var resolve = ( options.resolve ) ? options.resolve( fn, token.resolve ) : token.resolve;
    var reject =  ( options.reject )  ? options.reject( fn, token.reject )   : token.reject;
    
    args = args.concat([resolve, reject]);
    fn.apply( context, args );
    return token.promise;
  });

  return promiseFn;
};

function wrapAnySyncFunctionsWithBooleanPromiseHandling( fns, context, options ) {
  options = ( options || {} );

  return _.chain( fns )
    .compact()
    .map(function( fn ) {
      if ( fn.length === 0 ) {
        return function() {
          var token = Q.defer();
          
          // if the function returns true, resolve the promise
          // otherwise, reject it
          if ( fn.call( context ) === true ) 
            token.resolve();
          else 
            token.reject({ name: fn._name });

          return token.promise;
        }
      } else {
        return fn;
      }
    })
    .value();
};

function scopeName( newFn, oldFn ) {
  newFn._name = oldFn._name;
}

function wrapAnySequenceFunctionsThatRequestedPromises( fns, context, options ) {
  options = ( options || {} );

  return _.chain( fns )
    .compact()
    .map(function(fn, index) {
      var newFn = function( res ) {
        var args = [];

        // if the operation is after the first,
        // meaning that it could accept a result from 
        // a previous function, make
        // the first argument the result of the previous
        // function, even if it's undefined.
        if ( index >= 1 && options.sequence !== false || index === 0 && options.firstMethodTakesArgument === true ) args.push(res);
        
        // if we're dealing with the first item in the sequence
        // which cannot have a value returned from a previous promise,
        // then any arguments means resolve and reject are requested
        // If we're in a subsequent chain link, it is possible that 
        // a return value is requested, thusly, if only one argument is
        // specified, this means they only want the return value from the
        // previous promise, but if more than one is requested, they must want
        // at least the resolve fn, or both resolve and reject
        if (( index === 0 && options.firstMethodTakesArgument !== true && fn.length >= 1 ) || ( index >= 1 && fn.length >= 2 )) {
          fn = wrapWithPromise( fn, args, context, options );
        }
        
        // return the executed new function with the right args
        return fn.apply( context, args );
      }
      scopeName( newFn, fn );
      return newFn;
    })
    .value();
};

function returnArrayOfResultsFromExecutedFunctions( fns ) {
  return _.map(fns, function(fn) {
    return fn();
  });
};

function getObjectMethodsByName( fnNames, obj ) {
  return _.map( fnNames, function( fnName ) {
    var fn = obj[fnName];

    // if the function is found, scope the name of the function
    // to the function itself for later reference. 
    // Uses _name since name is read-only
    if ( fn ) { fn._name = fnName; }

    return fn;
  });
};

function returnBoundObjectMethods( fns, obj ) {
  return _.chain(fns)
    .compact()
    .map(function(fn) {
      var boundFn = _.bind( fn, obj );
      scopeName( boundFn, fn );
      return boundFn;
    })
    .value();
};

function memoizeAllFunctions( fns ) {
  return _.map( fns, function( fn ) {
    return _.memoize( fn );
  })
};

Q.sequence = function(fns, initialVal) {
  return fns.reduce(function (soFar, f) {
    return soFar.then(f);
  }, initialVal ? Q(initialVal) : Q.when());
};


exports.extend = extend;
exports.partialApply = partialApply;
exports.wrapWithPromise = wrapWithPromise;
exports.memoizeAllFunctions = memoizeAllFunctions;
exports.getObjectMethodsByName = getObjectMethodsByName;
exports.returnBoundObjectMethods = returnBoundObjectMethods;
exports.assignArgumentsAsProperties = assignArgumentsAsProperties;
exports.attachFunctionsToConstructorAndPrototye = attachFunctionsToConstructorAndPrototye;
exports.returnArrayOfResultsFromExecutedFunctions = returnArrayOfResultsFromExecutedFunctions;
exports.wrapAnySequenceFunctionsThatRequestedPromises = wrapAnySequenceFunctionsThatRequestedPromises;
exports.wrapAnySyncFunctionsWithBooleanPromiseHandling = wrapAnySyncFunctionsWithBooleanPromiseHandling;