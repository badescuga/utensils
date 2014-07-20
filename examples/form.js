var Utensils = require('utensils');

var AccountValidator = Utensils.Validator.extend({

  email: function() {
    return true;
  },

  gender: function(resolve, reject) {
    resolve();
  }

});