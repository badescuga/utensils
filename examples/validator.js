var utensils = require('./lib/utensils');
var Validator = utensils.Validator;



var AccountValidator = Validator.extend({

  email: function() {
    return true;
  },

  gender: function(resolve, reject) {
    resolve();
  }

});