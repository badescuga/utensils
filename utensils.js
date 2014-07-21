//     Utensils.js 0.1.1

//     (c) 2014 Michael Phillips
//     Utensils may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://utensilsjs.org

(function(root, factory) {

  // Set up Utensils appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'q', 'exports'], function(_, Q, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Utensils.
      root.Utensils = factory(root, exports, _, Q);
    });

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Q = require('q');
    factory(root, exports, _, Q);

  // Finally, as a browser global.
  } else {
    root.Utensils = factory(root, {}, root._, root.Q);
  }

}(this, function(root, Utensils, _, Q) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Utensils` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousUtensils = root.Utensils;

  // Current version of the library. Keep in sync with `package.json`.
  Utensils.VERSION = '0.1.0';

  // Runs Utensils.js in *noConflict* mode, returning the `Utensils` variable
  // to its previous owner. Returns a reference to this Utensils object.
  Utensils.noConflict = function() {
    root.Utensils = previousUtensils;
    return this;
  };

  var Base = Utensils.Base = function() {
    var self = this;
    var args = _.toArray( arguments );
    
    // cast .argumentName String to .argumentNames Array
    var argumentName = _.result( this, 'argumentName' );
    if ( _.isString( argumentName ) && _.isUndefined( this.argumentNames )) {
      this.argumentNames = [ argumentName ];
    }
    
    // store the original arguments Array on the instance
    // and prevent make it immutable to preserve raw input
    this.arguments = _.object( this.argumentNames, args );
    Object.freeze( this.arguments );

    // attach arguments to the instance 
    // with defined names if names are defined
    if ( this.argumentNames ) {
      _.each( args, function(value, index) {
        self[self.argumentNames[index]] = value;
      });
    }
  };

  Base.extend = extend;

  // Value
  // ---------------

  var Value = Utensils.Value = Base.extend({

    argumentName: 'value',

    // special method in JavaScript, is used for 
    // all comparators except equality, by default 
    // returns the same value as was passed
    // into the constructor
    valueOf: function() {
      return this[ this.argumentName ];
    }

  });

  // Functional equality utility method
  Value.isEqualTo = function( a, b ) {
    return a.valueOf() === b.valueOf();
  };

  // Functional inequality utility method
  Value.isNotEqualTo = function( a, b ) {
    return a.valueOf() !== b.valueOf();
  };

  // List of methods that are applied directly to the constructor
  // as static methods to offer a functional style, but 
  // should be offered as partially applied versions
  // on the prototype.
  var methodsToScopeToPrototype = [ 'isEqualTo', 'isNotEqualTo' ];
  
  // Scope the methods to the prototype,
  // pre-filling the first method with the instance
  _.each( methodsToScopeToPrototype, function( fnName ) {
    Value.prototype[fnName] = function() {
      return _.partial( Value[ fnName ], this ).apply( this, arguments );
    };
  });

  // Service
  // ---------------

  var Service = Utensils.Service = Base.extend({

    constructor: function() {
      Base.prototype.constructor.apply( this, arguments );

      // if only one method is defined on the extended object
      // use that one method for the procedure, meaning this.procedure
      // doesn't need to be defined explicitly if only one method is defined
      var protoPropFunctionKeys = _.without( _.functions( this.constructor.__protoProps__ ), 'error' );
      if ( protoPropFunctionKeys.length === 1 ) {
        this.procedure = protoPropFunctionKeys;
      }

      // if a procedure is either not defined or cannot be extrapolated,
      // throw error.
      if (_.isUndefined( this.procedure )) {
        throw new Error('Service object must have a defined procedure');
      }

      this.procedureMethods = prepareProcedureMethods.apply(this, [this.procedure]);
    },

    run: function(initialValue) {
      return promiseSequence.call( this, this.procedureMethods, initialValue)
        .fail(this.error);
    }

  });

  // Form
  // ---------------
  
  var Form = Utensils.Form = Base.extend({

    argumentName: 'data',

    // map #run for expressive API
    process: function() {
      return this.run.apply( this, arguments );
    },

    // default procedure for a form object 
    // is to first validate the input and then
    // process the form
    procedure: [
      'validate',
      'process'
    ],

    run: function() {
      var self = this;

      // if a constructor is defined on .validator, 
      // overwrite #validate with a promise-wrapped 
      // function returning a new instance of the constructor
      if ( this.validator ) {
        this.validate = function() { return new self.validator( self[ self.argumentNames[0] ] ).run(); };
      }

      // if a constructor is defined on .processor, 
      // overwrite #process with a promise-wrapped 
      // function returning a new instance of the constructor
      if ( this.processor ) {
        this.process = function() { return new self.processor( self.argumentNames[0] ).run(); };
      }
      
      var procedureMethods = prepareProcedureMethods( this.procedure );

      return promiseSequence( procedureMethods )
        .then(this.success)
        .fail(this.error);
    }

  });

  // Validator
  // ---------------

  var Validator = Utensils.Validator = Base.extend({

    argumentName: 'data',

    // map #run for expressive API
    validate: function() {
      return this.run.apply( this, arguments );
    },

    run: function() {
      // returns an object of all functions defined on the 
      // implementation of the Validator constructor
      // or, rather, is the object passed into Validator.extend
      var procedureMethods = this.prepareProcedureMethods( _.functions( this.constructor.__protoProps__ ) );

      // call all methods simultaneously, returning
      // all results
      var procedureMethodPromises = returnArrayOfResultsFromExecutedFunctions( procedureMethods );
      return Q.allSettled( procedureMethodPromises )
        .then( this.parseResults );
    },

    prepareProcedureMethods: function( procedureMethodKeys ) {
      var procedureMethods;

      procedureMethods = getObjectMethodsByName( procedureMethodKeys, this );
      procedureMethods = wrapAnySyncFunctionsWithBooleanPromiseHandling( procedureMethods, this );
      procedureMethods = wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, this, { 
        sequence: false, 
        reject: function( fn, reject ) {
          return function( error ) {
            return reject({ name: fn._name, error: error });
          };
        }
      });
      procedureMethods = returnBoundObjectMethods( procedureMethods, this );

      return procedureMethods;
    },

    parseResults: function( results ) {
      var deferred = Q.defer();
      var errors = _.chain(results)
        .filter( function( result ) { return result.state === 'rejected'; })
        .map( function( error ) { return error.reason; })
        .value();

      if ( errors.length > 0 ) {
        deferred.reject( errors );
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    }

  });

  // Query
  // ---------------
  
  var Query = Base.extend({

    // map #run for expressive API
    perform: function() {
      return this.run.apply( this, arguments );
    },

    run: function() {
      var self = this;

      var procedureMethods = prepareProcedureMethods( this.procedure );

      return this.setup()
        .then(function() {
          return promiseSequence( procedureMethods )
            .then(self.success)
            .fail(self.error);
        });
    },

    setup: function() {
      var self = this;

      return this.db()
        .then(function( db ) {
          return db;
        })
        .then(function( db ) {
          return self.buildCollections( db );
        });
    },

    // attach all collections to the object
    // context with the name of the collection
    // and "Collection", so for the "accounts" collection,
    // the collection would be scoped to the 
    // context as "accountsCollection"
    buildCollections: function( db ) {
      var self = this;

      // var foo = 'accounts';    
      // Q.ninvoke( db, 'collection', foo )
      //   .then(function( collection ) { console.log( collection ); });
      this.collections = {};
      var collectionPromises = _.map( this.collectionNames, function( collectionName ) {
        return Q.ninvoke( db, 'collection', collectionName )
          .then(function( collection ) {
            self.collections[ collectionName ] = collection;
          });
      });

      return Q.all( collectionPromises );
    }

  });

  // Presenter/View
  // -------------
  
  var Presenter = Utensils.Presenter = Utensils.View = Base.extend({

    constructor: function( data ) {
      // ensure the argument is cast into an array
      this.data = ( _.isArray( data ) ) ? data : [ data ];
      
      // freeze the original data
      _.each( this.data, Object.freeze );
    },

    // map #run for expressive API
    present: function() {
      return this.run.apply( this, arguments );
    },

    run: function( returnKeys ) {
      var self = this;

      this.returnKeys = returnKeys;

      _.bindAll( this, 
        'results',

        '_whitelist', 
        '_blacklist', 
        '_propertyMap',
        '_customAttributes'
      );

      // execute the presenter methods on all items
      var presentPromises = _.map( this.data, function( item ) {
        return new Q( self.runOne( item ) );
      });

      // return a promise representing the state
      // of all items being presented
      return Q.all( presentPromises )
        .then( this.results );
    },

    runOne: function( item ) {
      var self = this;
      var result = _.clone(item);
      var deferred = Q.defer();
      
      result = _.compose(
        deferred.resolve,
        function( result ) {
          return _.extend( result, self._customAttributes( item ) );
        },
        this._propertyMap,
        this._blacklist,
        this._whitelist
      )( result );

      return deferred.promise;
    },

    results: function( results ) {
      var self = this;

      // if a specific set of return keys was specified
      // filter the results to just those properties
      if ( this.returnKeys ) {
        results = _.map( results, function( result ) {
          return _.pick.call( null, result, self.returnKeys );
        });
      }

      if ( _.isArray( this.data ) ) {
        return results;
      } else {
        return results[0];
      }
    },

    // whitelist keys
    _whitelist: function( item ) {
      if ( !this.whitelist ) { return item; }

      return _.pick.call( null, item, this.whitelist );
    },

    // blacklist keys
    _blacklist: function( item ) {
      if ( !this.blacklist ) { return item; }

      return _.omit.call( null, item, this.blacklist );
    },

    // rename properties
    _propertyMap: function( item ) {
      if ( !this.propertyMap ) { return item; }
      
      _.each( this.propertyMap, function( value, key ) {
        item[ value ] = item[ key ];
        delete item[ key ];
      });

      return item;
    },

    _customAttributes: function( item ) {
      var result = {};

      var customAttributeFunctions = this.prepareProcedureMethods( _.functions( this.constructor.__protoProps__ ), { 
        context: { item: item } 
      });

      _.each( customAttributeFunctions, function( fn ) {
        result[ fn._name ] = fn();
      });

      return result;
    }

  });

  // Policy
  // ---------------
  
  var Policy = Utensils.Policy = Base.extend({

    // map #run for expressive API
    analyze: function() {
      return this.run.apply( this, arguments );
    },

    run: function() {
      // returns an object of all functions defined on the 
      // implementation of the Validator constructor
      // or, rather, is the object passed into Validator.extend
      var procedureMethods = this.prepareProcedureMethods( _.functions( this.constructor.__protoProps__ ), { 
        context: _.pick.call( null, this, this.argumentNames )
      });

      // call all methods simultaneously, returning
      // all results
      var procedureMethodPromises = returnArrayOfResultsFromExecutedFunctions( procedureMethods );
      return Q.allSettled( procedureMethodPromises )
        .then( this.parseResults );
    },

    prepareProcedureMethods: function( procedureMethodKeys, options ) {
      options = ( options || {} );
      var procedureMethods;

      procedureMethods = getObjectMethodsByName( procedureMethodKeys, this );
      procedureMethods = wrapAnySyncFunctionsWithBooleanPromiseHandling( procedureMethods, options.context || this, options );
      procedureMethods = wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, options.context || this, { 
        sequence: false, 
        reject: function( fn, reject ) {
          return function( error ) {
            return reject({ name: fn._name, error: error });
          };
        }
      });
      procedureMethods = returnBoundObjectMethods( procedureMethods, options.context || this );

      return procedureMethods;
    },

    parseResults: function( results ) {
      var deferred = Q.defer();
      var errors = _.chain(results)
        .filter( function( result ) { return result.state === 'rejected'; })
        .map( function( error ) { return error.reason; })
        .value();

      if ( errors.length > 0 ) {
        deferred.reject( errors );
      } else {
        deferred.resolve( this.arguments );
      }

      return deferred.promise;
    }

  });

  // Decorator
  // -------------
  
  var Decorator = Utensils.Decorator = Base.extend({

    constructor: function( obj ) {
      if ( arguments.length === 0 ) { return; }

      var self = this;
      var sequence = self.returnSequence.bind( self )();
      var methodToDecorate = obj[ this.methodToDecorate ].bind( obj );
      var decoratedMethod = function() {
        return Q.when( methodToDecorate() )
          .then( sequence );
      };
      obj[ this.methodToDecorate ] = decoratedMethod;

      return obj;
    },

    returnSequence: function() {
      // if only one method is defined on the prototype
      // use that for the procedure, meaning this.procedure
      // doesn't need to be described with just one value
      if ( !this.procedure ) {
        var protoPropProcedureMethods = _.functions( this.constructor.__protoProps__ );
        if ( protoPropProcedureMethods.length === 1 ) {
          this.procedure = protoPropProcedureMethods;
        }
      }

      var procedureMethods = this.prepareProcedureMethods( this.procedure, { 
        firstMethodTakesArgument: true 
      });

      return function() {
        var args = [ procedureMethods ].concat( _.toArray( arguments ) );
        return promiseSequence.apply( null, args );
      };
    }

  });

  // Helpers
  // -------

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
    child.prototype = new Surrogate();

    if (protoProps) { _.extend(child.prototype, protoProps); }

    child.__super__ = parent.prototype;
    child.__protoProps__ = protoProps;

    return child;
  }

  // Attach #extend to each of the base objects
  _.each([ Value, Service, Form, Validator, Query, Presenter, Policy, Decorator ], function( Ctor ) {
    Ctor.extend = extend;
  });

  function prepareProcedureMethods( procedureMethodKeys, options ) {
    options = ( options || {} );
    
    var procedureMethods;

    procedureMethods = getObjectMethodsByName( procedureMethodKeys, this, options );
    procedureMethods = wrapAnySequenceFunctionsThatRequestedPromises( procedureMethods, options.context || this, options );
    procedureMethods = returnBoundObjectMethods( procedureMethods, options.context || this, options );


    return procedureMethods;
  }

  function promiseSequence(fns, initialValue) {
    return fns.reduce(function (soFar, f) {
      return soFar.then(f);
    }, initialValue ? new Q(initialValue) : Q.when());
  }

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
  }

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
            if ( fn.call( context ) === true ) {
              token.resolve();
            } else {
              token.reject({ name: fn._name });
            }

            return token.promise;
          };
        } else {
          return fn;
        }
      })
      .value();
  }

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
          if ( options.sequence !== false ) {
            args.push(res);
          }
          
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
        };
        scopeName( newFn, fn );
        return newFn;
      })
      .value();
  }

  function returnArrayOfResultsFromExecutedFunctions( fns ) {
    return _.map(fns, function(fn) {
      return fn();
    });
  }

  function getObjectMethodsByName( fnNames, obj ) {
    return _.map( fnNames, function( fnName ) {
      var fn = obj[fnName];

      // if the function is found, scope the name of the function
      // to the function itself for later reference. 
      // Uses _name since name is read-only
      if ( fn ) { fn._name = fnName; }

      return fn;
    });
  }

  function returnBoundObjectMethods( fns, obj ) {
    return _.chain(fns)
      .compact()
      .map(function(fn) {
        var boundFn = _.bind( fn, obj );
        scopeName( boundFn, fn );
        return boundFn;
      })
      .value();
  }

  return Utensils;

}));