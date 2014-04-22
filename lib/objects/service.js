var scopeArguments = require('../utilities/utilities').scopeArguments;
var call = require('../utilities/utilities').call;

var Service = function() {
  scopeArguments.call( this, this.call, arguments );
  if ( !this.call ) throw Error('Service Object must have a call method defined');
  return this.call( arguments );
}

Service.call = call;

module.exports = Service;