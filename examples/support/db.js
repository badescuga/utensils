var mongodb = require('mongodb');
var Q = require('q');

module.exports = function() {
  return Q.ninvoke( mongodb.MongoClient, 'connect', 'mongodb://localhost/utensils' );
}

