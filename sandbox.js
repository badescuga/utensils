var utilities = require('./lib/utilities/utilities');
var _ = require('underscore');

var Base = function() {
  var self = this;
  _.chain(arguments).toArray().each(function(a, index){
    self[self.arguments[index] || String.fromCharCode(97 + index)] = a;
  });
}
Base.extend = utilities.extend;
Base.prototype.new = function(){
  var args = arguments
  var constructor = this
  function This() {
    constructor.apply(this, args)
  }
  This.prototype = constructor.prototype
  return new This;
}

var Value = Base.extend({

  arguments: ['value'],

  valueOf: function() {
    return this.value;
  }

});

var Service = Base.extend({});

var MyService = Service.extend({

  arguments: ['bar', 'bag']

});



var value = new Value(4);
var myService = new MyService(4);