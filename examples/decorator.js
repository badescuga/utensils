var Utensils = require('../lib/utensils');

var SignIntoApp1 = Utensils.Decorator.extend({

  methodToDecorate: 'save',

  procedure: [
    'postToWall',
    'analytics'
  ],

  postToWall: function( comment ) {
    return 'bar';
  },

  analytics: function( string, resolve, reject ) {
    reject('blah');
  }

});

var SignIntoApp2 = Utensils.Decorator.extend({

  methodToDecorate: 'save',

  sendAjaxRequest: function( string ) {
    console.log('sendAjaxRequest', string);
  }

});

var MyService = Utensils.Service.extend({

  save: function( resolve, reject ) {
    reject('foo');
  },

  baz: 'bang'

});

var signUpService = new MyService({ first: 'Michael', last: 'Phillips' });
var signUp = new SignIntoApp2( new SignIntoApp1( signUpService ));
signUp.run().fail(function() { console.log( 'fail', arguments ); });
console.log(signUp instanceof MyService);