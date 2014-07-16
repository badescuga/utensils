var _ = require('underscore');

var patterns = {
  Base: require('./objects/base'),
  Value:     require('./objects/value'),
  Service:   require('./objects/service'),
  Form:      require('./objects/form'),
  Validator: require('./objects/validator'),
  Query:     require('./objects/query'),
  Presenter: require('./objects/presenter'),
  Policy:    require('./objects/policy'),
  Decorator: require('./objects/decorator')
}

module.exports = patterns;

