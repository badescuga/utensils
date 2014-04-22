// define global dependencies on the global object
global.Q = require('q');
global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
global._ = require('underscore');

// configure
global.Q.longStackTraces = true;
global.chai.use( sinonChai );