var utensils = require('../lib/utensils');
var Presenter = utensils.Presenter;



var AccountPresenter = Presenter.extend({

  whitelist: ['first', 'last'],

  propertyMap: {
    first: 'firstName',
    last: 'lastName'
  },

  fullNameFL: function() {
    return [this.item.first, this.item.last].join(' ');
  },

  fullNameLF: function() {
    return [this.item.last + ',', this.item.first].join(' ');
  }

});


var accounts = {
  id: '1234',
  first: 'Michael',
  last: 'Phillips',
  gender: 'm',
  diagnostic: {
    feelings_results: [
      {
        id: 123,
        strength: 2
      },
      {
        id: 124,
        strength: 3
      }
    ]
  }
};

new AccountPresenter(accounts).present()
  .then(function( presentedAccount ){ console.log( 'done', presentedAccount ); })
