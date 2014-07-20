// define global dependencies on the global object
global.Q = require('q');
global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
global.chaiAsPromised = require('chai-as-promised');
global._ = require('underscore');
global.Utensils = require('../lib/utensils');

// configure
global.Q.longStackTraces = true;
global.chai.use( sinonChai );
global.chai.use( chaiAsPromised );