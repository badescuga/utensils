var _ = require('underscore');
var Q = require('q');
var utilities = require('../utilities/utilities');
var Base = require('./base');



var Presenter = Base.extend({

  constructor: function( data ) {
    // ensure the argument is cast into an array
    this.data = ( _.isArray( data ) ) ? data : [ data ];
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
      return Q( self.runOne( item ) );
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
    if ( !this.whitelist ) return item;

    return _.pick.call( null, item, this.whitelist );
  },

  // blacklist keys
  _blacklist: function( item ) {
    if ( !this.blacklist ) return item;

    return _.omit.call( null, item, this.blacklist );
  },

  // rename properties
  _propertyMap: function( item ) {
    if ( !this.propertyMap ) return item;
    
    _.each( this.propertyMap, function( value, key ) {
      item[ value ] = item[ key ];
      delete item[ key ];
    });

    return item;
  },

  _customAttributes: function( item ) {
    var self = this;
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

module.exports = Presenter;