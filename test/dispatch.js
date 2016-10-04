var dispatch = require( '../lib/dispatch' );
var createApp = require( '../createDefaultApp' );

describe( 'The dispatcher', function () {

  it( 'should report usage', function () {
    return dispatch( [], createApp );
  } );

  it( 'should have a version option', function () {
    return dispatch( [ '-v' ], createApp );
  } );

  it( 'should have a help option', function () {
    return dispatch( [ '-h' ], createApp );
  } );

} );
