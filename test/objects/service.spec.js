var Service = require('../../lib/utensils').Service;

var service1;
var spy;

describe('Service', function() {

  before( function() {
    Service = Service.extend({
      initialize: function() {}
    });
    spy = sinon.spy( Service.prototype, 'initialize' );
    service1 = new Service();
  });

  describe('#initialize', function() {

    it('runs on initialization', function() {
      expect( spy ).to.have.been.calledOnce;
    });

  });

});