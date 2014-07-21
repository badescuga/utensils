var repl = require("repl");
var utensils = require('./utensils');
var utilities = require('./utilities/utilities');
var Q = require('q');
var _ = require('underscore');
 
var replServer = repl.start({
  prompt: "utensils > ",
});
 
replServer.context.Value = utensils.Value;
replServer.context.Service = utensils.Service;
replServer.context.Q = Q;
