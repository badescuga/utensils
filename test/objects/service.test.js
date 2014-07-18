var Service = require('../../lib/utensils').Service;

var service1;
var spy;

describe('Service', function() {

  before( function() {
    Service = Service.extend({
      procedures: [
        this.step1,
        this.step2
      ],
      step1: function
    });
    service1 = new Service();
  });

});