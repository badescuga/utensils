global._ = require('underscore');
global.Q = require('q');
global.Q.longStackTraces = true;

global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');

global.chaiAsPromised = require('chai-as-promised');
global.chai.use( chaiAsPromised );

global.sinonChai = require('sinon-chai');
global.chai.use( sinonChai );

// lib
global.Utensils = require('../utensils');