var swaggerMerge = require( '../lib/swaggerMerge' );
var swaggerMin = require( '../lib/swaggerMin' );

describe( 'swaggerMerge and swaggerMin', function () {

  it( 'should be able to merge and minify recursive structures', function () {
    return swaggerMerge(
      [ 'test/recursive.yaml',  'test/merge.yaml' ]
    ).then( swaggerMin ).then( function ( api ) {
      console.log( JSON.stringify( api, null, '  ' ) );
    } );
  } );

} );
