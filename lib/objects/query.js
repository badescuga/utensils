var Base = require('./base');
var Q = require('q');
var _ = require('underscore');
var utilities = require('../utilities/utilities')

var Query = Base.extend({

  // map #run for expressive API
  perform: function() {
    return this.run.apply( this, arguments );
  },

  run: function() {
    var self = this;

    var procedureMethods = this.prepareProcedureMethods( this.procedure );

    return this.setup()
      .then(function() {
        return Q.sequence( procedureMethods )
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

  toArray: function( queryResults ) {
    return Q.ninvoke( queryResults, 'toArray' );
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

module.exports = Query;
