var Utensils = require('utensils');

var CreateAccount = Utensils.Service.extend({

  argumentNames: ['account'],

  procedure: [
    'saveToDatabase',
    'sendWelcomeEmail'
  ],

  saveToDatabase: function( resolve, reject ) {
    resolve();
  },

  sendWelcomeEmail: function() {
    throw new Error('foo');
  }

});
