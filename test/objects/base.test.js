var Base = Utensils.Base;

describe('Base', function(){
  
  describe('#constructor', function(){
    
    describe('.argumentName', function(){
      
      it('casts .argumentName string to .argumentNames array', function(){
        var base = new (Base.extend({ 
          argumentName: 'student' 
        }))();

        expect( base.argumentNames ).to.be.instanceOf( Array );
        expect( base.argumentNames ).to.have.length( 1 );
        expect( base.argumentNames ).to.eql([ 'student' ]);
      });

      it('accepts a function for .argumentName', function(){
        var base = new (Base.extend({ 
          argumentName: function(){ 
            return 'student';
          }
        }))();

        expect( base.argumentNames ).to.eql([ 'student' ]);
      });

      it('only accepts a string', function(){
        var base = new (Base.extend({ 
          argumentName: {}
        }))();
        
        expect( base.argumentNames ).to.be.undefined;
      });

      it('doesn\'t overwrite .argumentNames if also defined', function(){
        var base = new (Base.extend({ 
          argumentName: 'student',
          argumentNames: ['student', 'teacher']
        }))();
        
        expect( base.argumentNames ).to.eql([ 'student', 'teacher' ]);
      });
      
    });
    
    describe('.arguments', function(){
      
      it('attaches to the instance', function(){
        var base = new (Base.extend({ 
          argumentNames: ['first', 'last']
        }))('John', 'Smith');

        expect( base.arguments ).to.eql({ first: 'John', last: 'Smith' });
      });
      
    });
    
  });
  
});