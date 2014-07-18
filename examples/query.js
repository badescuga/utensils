var utensils = require('./lib/utensils');
var Query = utensils.Query;
var db = require('./db');
var Q = require('q');



var ActiveAccountsQuery = Query.extend({

  db: db,

  collectionsNames: [
    'accounts',
    'cars'
  ],

  procedure: [
    'getAccounts',
    'somethingAsync'
  ],

  getAccounts: function() {
    return Q.ninvoke( this.collections.accounts, 'find' )
      .then( this.toArray );
  },

  somethingAsync: function( accounts ) {
    return Q.ninvoke( this.collections.cars, 'find')
      .then( this.toArray );
  }

});



new ActiveAccountsQuery().perform()
  .then(function( documents ){ console.log( 'done', documents ); })
  .fail(function( errors ){ console.log('fail', arguments ) });