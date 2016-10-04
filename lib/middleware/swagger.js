var express = require( 'express' );
var swaggerMiddleware = require( 'swagger-express-middleware' );

module.exports = swagger;

// set up swagger-express-middleware, pokemock-style
function swagger( api, app ) {

  var ready = new Promise( function ( resolve, reject ) {

    swaggerMiddleware( api, app, function ( err, middleware ) {

      if ( err ) reject( err );

      resolve( express.Router().use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.files(),
        middleware.parseRequest(),
        middleware.validateRequest(),
        function ( err, req, res, next ) {
          next( err.stack.match( /Maximum call stack size exceeded/ ) ? null : err );
        }
      ) );

    } );

  } );

  return function ( req, res, next ) {
    ready.then( function ( router ) {
      router.handle( req, res, next );
    } ).catch( next );
  };

}
