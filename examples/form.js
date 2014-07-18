var utensils = require('./lib/utensils');
var Form = utensils.Form;



var AccountValidator = Validator.extend({

  email: function() {
    return true;
  },

  gender: function(resolve, reject) {
    resolve();
  }

});