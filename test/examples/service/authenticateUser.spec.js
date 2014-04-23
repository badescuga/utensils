var AuthenticateUser = require('../../../examples/service/authenticateUser');

var user;
var authenticateUser;

describe('AuthenticateUser', function() {

  before( function() {
    user = {
      salt: '$2a$10$zOoZ/y1TocgFAr/sq3ipNO',
      passwordHash: '$2a$10$cxvX4N0Fiv2OwwgtCR1k0u3/Ewzuos8N5rjTrziXN037ObiWrfS/a' // foobar
    };
  });

  describe('#authenticate', function() {

    describe('successful authentication', function() {

      before( function() {
        authenticateUser = new AuthenticateUser( user ).authenticate( 'foobar' );
      });

      after( function() {
        delete user.lastLoginTimestamp;
      });

      it('returns the user', function() {
        expect( authenticateUser ).to.eventually.equal( user );
      });

      it('updates the lastLoginTimestamp of the user', function( done ) {
        authenticateUser.then( function() {
          expect( user.lastLoginTimestamp ).to.be.instanceof( Date );
          done();
        })
      });

    })

    describe('unsuccessful authentication', function() {

      before( function() {
        authenticateUser = new AuthenticateUser( user ).authenticate( 'foobarbaz' );
      });

      it('returns false', function() {
        expect( authenticateUser ).to.eventually.equal( false );
      });

      it('updates the lastLoginTimestamp of the user', function( done ) {
        authenticateUser.then( function() {
          expect( user.lastLoginTimestamp ).to.be.undefined;
          done();
        })
      });

    })

  });

});
