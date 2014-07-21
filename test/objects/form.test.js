var Q = require('q');

describe('Form', function(){
  
  describe('#constructor', function(){

    it('requires a process method', function(){
      var createNewFormWithoutProcessMethod = function() {
        return new (Utensils.Form.extend());
      }

      expect( createNewFormWithoutProcessMethod ).to.throw( Error );
    });
    
    it('executes the base constructor', function(){
      var baseConstructor = sinon.spy( Utensils.Base.prototype, 'constructor' );
      var form = new (Utensils.Form.extend({
        process: function(){}
      }));

      expect(baseConstructor).to.have.been.calledOnce;
    });

    it('overrides #validate if .validator is specified', function( done ){
      var Validator = Utensils.Validator.extend();
      var ValidatorSpy = sinon.spy( Validator );
      var form = new (Utensils.Form.extend({
        validator: ValidatorSpy,
        process: function(){}
      }));

      expect( form.validate ).to.be.an.instanceOf( Function );

      form.run().then(function() {
        expect( ValidatorSpy ).to.have.been.calledWithNew;
        done();
      });
    });

    it('overrides #process if .processor is specified', function( done ){
      var Processor = Utensils.Service.extend({
        process: function() { return true }
      });
      var ProcessorSpy = sinon.spy( Processor );
      var form = new (Utensils.Form.extend({
        processor: ProcessorSpy
      }));

      expect( form.process ).to.be.an.instanceOf( Function );

      form.run().then(function() {
        expect( ProcessorSpy ).to.have.been.calledWithNew;
        done();
      })
      .fail(function(){ console.log(arguments) });
    });

  });
  
  describe('#run', function(){
    
    it('returns a promise', function(){
      var form = new (Utensils.Form.extend({
        validate: function(){},
        process: function(){}
      }));
      
      expect( form.run() ).to.be.an.instanceOf( Q.makePromise );
    });
    
  });

});