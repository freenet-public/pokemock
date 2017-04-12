var parser = require( 'json-schema-ref-parser' );
var _ = require( 'lodash' );

// TODO candidate for separate module

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
    normalizeSecurity( api );

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
    return swaggerMerge( apis.slice( 1 ), options ).then( function ( api2 ) {

      if ( options.mergeDescriptions ) {
        if ( api2.info.title ) api.info.description += '\n\n## ' + api2.info.title;
        if ( api2.info.description ) api.info.description += '\n\n' + api2.info.description;
      }

      // add tags only once
      api2.tags.forEach( function ( tag2 ) {
        if ( api.tags.filter( function ( tag ) {
          return tag.name === tag2.name;
        } ).length === 0 ) {
          api.tags.push( tag2 );
        }
      } );

      // add definitions
      // collisions are resolved by appending underscores
      _.assignIn(
        api.definitions,
        _.mapKeys( api2.definitions, function ( definition, name ) {
          while ( api.definitions[ name ] ) name += '_';
          return name;
        } )
      );

      // add security definitions
      // collisions are resolved by appending underscores
      _.assignIn(
        api.securityDefinitions,
        _.mapKeys( api2.securityDefinitions, function ( definition, name ) {
          var newName = name;
          while ( api.securityDefinitions[ newName ] ) newName += '_';
          replaceSecurityName( api2, name, newName );
          return newName;
        } )
      );

      // add paths
      _.assignIn( api.paths, api2.paths );

      return api;

    } );

  } );

}

function normalizeSecurity( api ) {
  _.forEach( api.paths, function ( operations ) {
    _.forEach( operations, function ( operation ) {
      if ( api.security || operation.security ) {
        operation.security = _.uniqBy(
          ( api.security || [] ).concat( operation.security || [] ),
          JSON.stringify
        );
      }
    } );
  } );

  delete api.security;
}

function replaceSecurityName( api, name, newName ) {
  _.forEach( api.paths, function ( operations ) {
    _.forEach( operations, function ( operation ) {
      if ( !operation.security ) return;
      operation.security = operation.security.map( function ( object ) {
        return _.mapKeys( object, function ( scopes, n ) {
          return n === name ? newName : name;
        } );
      } );
    } );
  } );
}
