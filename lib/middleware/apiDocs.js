var parser = require( 'json-schema-ref-parser' );
var _ = require( 'lodash' );
var swaggerMerge = require( '../swaggerMerge' );

module.exports = apiDocs;

function apiDocs( apis ) {

  if ( !Array.isArray( apis ) ) apis = [ apis ];

  var ready = swaggerMerge( apis ).then( function ( api ) {
    return parser.bundle( api );
  } ).then( function ( bundle ) {

    // copy api for api-docs
    // swaggerMiddleware inserts circular refs
    bundle = _.cloneDeep( bundle );

    // cannot mock APIs with a specified host, remove it
    delete bundle.host;

    return bundle;

  } );

  return function ( req, res, next ) {
    ready.then( function ( bundle ) {
      res.json( bundle );
    } ).catch( next );
  };

}
