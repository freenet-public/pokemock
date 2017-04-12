var parser = require( 'json-schema-ref-parser' );
var _ = require( 'lodash' );
var swaggerMerge = require( '../swaggerMerge' );
var swaggerMin = require( '../swaggerMin' );

module.exports = apiDocs;

function apiDocs( apis ) {

  if ( !Array.isArray( apis ) ) apis = [ apis ];

  var ready = swaggerMerge( apis ).then( swaggerMin ).then( function ( api ) {
    // copy api for api-docs
    // swaggerMiddleware inserts circular refs
    api = _.cloneDeep( api );

    // cannot mock APIs with a specified host, remove it
    delete api.host;

    return api;

  } );

  return function ( req, res, next ) {
    ready.then( function ( api ) {
      res.json( api );
    } ).catch( next );
  };

}
