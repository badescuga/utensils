var utensils = require('./lib/utensils');
var Service = utensils.Service;



var CreateAccount = Service.extend({

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
