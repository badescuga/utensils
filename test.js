var Form = require('./lib/utensils').Form;
var Validator = require('./lib/utensils').Validator;
var _ = require('underscore');

var MyValidator = Validator.extend({

  foo: function() {
    return true;
  },

  bar: function(resolve, reject) {
    reject('problem, sir');
  }

});

var MyForm = Form.extend({

  validator: MyValidator

});

var myForm = new MyForm({first: 'michael', last: 'phillips'});

myForm.process()
  .then(function(){ console.log('done, yay!', arguments) })
  .fail(function(){ console.log('fail, sad!', arguments) });
