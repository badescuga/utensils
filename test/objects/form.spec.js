var Form = require('../../lib/utensils').Form;

var form1;
var data;

describe('Form', function() {

  before( function() {
    data = { name: 'Michael', age: 27 };
    form1 = new Form( data );
  });

  it('sets this.data', function() {
    form1.data === data;
  })

});