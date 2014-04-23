var Service = require('utensils').Service;
var bcrypt = require('bcrypt');
var Q = require('q');

var AuthenticateUser = Service.extend({

  initialize: function( user ) {
    this.user = user;
  },

  authenticate: function( password ) {
    var self = this;

    return this.checkPassword( password )
      .then( function() {
        self.saveLastLoginTimestamp();
        return self.user;
      })
      .fail( function() {
        return false;
      })
  },

  checkPassword: function( password ) {
    return Q.nfcall( bcrypt.compare, password, this.user.passwordHash )
      .then( function( wasSuccessful ) {
        if ( !wasSuccessful ) { throw new Error('authentication unsuccessful'); }
        return wasSuccessful;
      })
  },

  saveLastLoginTimestamp: function() {
    return this.user.lastLoginTimestamp = new Date();
  }

})

module.exports = AuthenticateUser;