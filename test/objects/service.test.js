var Q = require('q');
var Service = Utensils.Service;

describe('Service', function() {

  describe('#constructor', function(){
    
    it('executes the base constructor', function(){
      var baseConstructor = sinon.spy( Utensils.Base.prototype, 'constructor' );
      var service = new (Utensils.Service.extend({
        procedure: ['firstOperation', 'secondOperation'],
        firstOperation: function() { a = arguments[0]; return 'firstOperation'; },
        secondOperation: function() { b = arguments[0]; return 'secondOperation'; }
      }));

      expect(baseConstructor).to.have.been.calledOnce;
    });
    
  });

  describe('.procedure', function(){
    
    it('is required unless only one method is defined', function(){
      var createNewServiceWithoutMethods = function() {
        return new (Utensils.Service.extend()); 
      }

      var createNewServiceWithOneMethod = function() {
        return new (Utensils.Service.extend({
          firstOperation: function() {}
        })); 
      }

      var createNewServiceWithMultipleMethods = function() {
        return new (Utensils.Service.extend({
          firstOperation: function() {},
          secondOperation: function() {},
        })); 
      }
      
      expect( createNewServiceWithoutMethods ).to.throw( Error );
      expect( createNewServiceWithOneMethod ).to.not.throw( Error );
      expect( createNewServiceWithMultipleMethods ).to.throw( Error );
    });
    
  });

  describe('run', function(){
    
    it('calls the methods in the order defined', function( done ){
      var a, b, c;
      var service = new (Utensils.Service.extend({
        procedure: ['firstOperation', 'secondOperation'],
        firstOperation: function() { a = arguments[0]; return 'firstOperation'; },
        secondOperation: function() { b = arguments[0]; return 'secondOperation'; }
      }));

      service.run('initialValue').then(function(){ 
        c = arguments[0];

        expect(a).to.equal('initialValue');
        expect(b).to.equal('firstOperation');
        expect(c).to.equal('secondOperation');
        done();
      });
    });

    it('returns a promise', function(){
      var service = new (Utensils.Service.extend({
        firstOperation: function() {}
      }));
      
      expect( service.run() ).to.be.an.instanceOf( Q.makePromise );
    });
    
    it('fails if any error is thrown along the chain', function(){
      var b;
      var service = new (Utensils.Service.extend({
        procedure: ['firstOperation', 'secondOperation'],
        firstOperation: function() { throw new Error('first operation errored'); },
        secondOperation: function() {}
      }));
      
      return expect( service.run() ).to.eventually.be.rejectedWith(Error, 'first operation errored');
    });

    it('executes #error if defined', function( done ){
      var errorResult;
      var service = new (Utensils.Service.extend({
        procedure: ['firstOperation', 'secondOperation'],
        firstOperation: function() { throw new Error('first operation errored'); },
        secondOperation: function() {},
        error: function() { errorResult = arguments; }
      }));
      
      service.run().fin(function() {
        expect(errorResult[0]).to.be.instanceOf( Error, 'first operation errored' );
        done();
      })
    });

  });

});