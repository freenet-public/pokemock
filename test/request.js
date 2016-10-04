var request_ = require( 'request' );

module.exports = request;

function request( url, options ) {
  if ( options ) options.url = url;
  if ( !options ) options = url;
  return new Promise( function ( resolve, reject ) {
    request_( options, function ( err, res ) {
      if ( err ) return reject( err );
      resolve( res );
    } );
  } );
}
