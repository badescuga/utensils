var utensils = require('./lib/utensils');
var Form = utensils.Form;
var Validator = utensils.Validator;
var Service = utensils.Service;



var AccountValidator = Validator.extend({

  email: function() {
    return true;
  },

  gender: function(resolve, reject) {
    resolve();
  }

});



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



var MyForm = Form.extend({

  validator: AccountValidator,

  persistor: CreateAccount,

});



new MyForm({first: 'michael', last: 'phillips'}).process()
  .then(function(){ console.log('done' ) })
  .fail(function( errors ){ console.log('fail' ) });
