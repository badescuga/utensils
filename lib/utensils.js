var _ = require('underscore');

var patterns = {
  Value:     require('./objects/value'),
  Service:   require('./objects/service'),
  Form:      require('./objects/form'),
  Query:     require('./objects/query'),
  Presenter: require('./objects/presenter'),
  Policy:    require('./objects/policy'),
  Decorator: require('./objects/decorator')
}

// add the static extend method to each pattern, enabling var MyCustomValueObject = Value.extend({});
_.each( _.values( patterns ), function( Pattern ) {
  Pattern.extend = require('./utilities/utilities').extend;
})

module.exports = patterns;