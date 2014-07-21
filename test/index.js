global._ = require('underscore');
global.Q = require('q');
global.Q.longStackTraces = true;

global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');

global.sinonChai = require('sinon-chai');
global.chai.use( sinonChai );

global.chaiAsPromised = require('chai-as-promised');
global.chai.use( chaiAsPromised );

// lib
global.Utensils = require('../lib/utensils');