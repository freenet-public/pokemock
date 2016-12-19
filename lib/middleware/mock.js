var _ = require( 'lodash' );
var softParse = require( '../softParse' );

module.exports = mock;

// generates mock data using the given generator steps
// see generate.js for example steps
function mock( steps, static ) {

  return function ( req, res, next ) {

    // only generate mock data if we have a schema
    if ( !res.schema ) return next();

    // add x-definition to api definitions
    _.each( req.swagger.api.definitions, function ( definition, name ) {
      definition[ 'x-definition' ] = name;
    } );

    if ( static ) {

      res.body_ = res.examples

    } else {

      var limits = softParse( req.headers[ 'x-mock-size' ], {} );
      var maxDepth = parseInt( req.headers[ 'x-mock-depth' ] || 5 );

      res.body_ = generate( 'root', res.schema, {
        chance: req.chance,
        limits: limits,
        maxDepth: maxDepth
      }, generate, 0 );

      function generate( name, schema, options, gen, depth ) {
        for ( var i = 0, l = steps.length; i < l; ++i ) {
          var value = steps[ i ]( name, schema, options, gen, depth );
          if ( value !== undefined ) return value;
        }
        return 'UNSUPPORTED';
      }

    }

    next();

  };

}
