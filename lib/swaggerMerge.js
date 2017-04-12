var parser = require( 'json-schema-ref-parser' );
var _ = require( 'lodash' );

module.exports = swaggerMerge;

function swaggerMerge( apis, options ) {

  options = options || {};

  if ( apis.length === 0 ) return Promise.reject( new Error( 'swaggerMerge requires at least one API' ) );

  return parser.dereference( apis[ 0 ] ).then( function ( api ) {

    api.tags = api.tags || [];
    api.paths = api.paths || {};
    api.definitions = api.definitions || {};
    api.securityDefinitions = api.securityDefinitions || {};
    api.info = api.info || {};
    api.info.title = api.info.title || '';
    api.info.description = api.info.description || '';

    // resolve base path
    if ( api.basePath ) {

      api.paths = _.mapKeys( api.paths, function ( data, path ) {
        // the final replace() removes double and trailing slashes
        return ( api.basePath + '/' + path ).replace( /\/+(\/|$)/g, '$1' );
      } );

      delete api.basePath;

    }

    if ( apis.length === 1 ) return api;

    // merge the rest
    return swaggerMerge( apis.slice( 1 ), options ).then( function ( api_ ) {

      if ( options.mergeDescriptions ) {
        if ( api_.info.title ) api.info.description += '\n\n## ' + api_.info.title;
        if ( api_.info.description ) api.info.description += '\n\n' + api_.info.description;
      }

      // add tags only once
      api_.tags.forEach( function ( tag_ ) {
        if ( api.tags.filter( function ( tag ) {
          return tag.name === tag_.name;
        } ).length === 0 ) {
          api.tags.push( tag_ );
        }
      } );

      // add paths
      _.assignIn( api.paths, api_.paths );

      // add definitions
      // collisions are resolved by appending underscores
      _.assignIn(
        api.definitions,
        _.mapKeys( api_.definitions, function ( definition, name ) {
          while ( api.definitions[ name ] ) name += '_';
          return name;
        } )
      );

      // add security definitions
      // collisions are resolved by appending underscores
      _.assignIn(
        api.securityDefinitions,
        _.mapKeys( api_.securityDefinitions, function ( definition, name ) {
          while ( api.securityDefinitions[ name ] ) name += '_';
          return name;
        } )
      );

      return api;

    } );

  } );

}
