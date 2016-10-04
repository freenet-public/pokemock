var jsonpath = require( 'jsonpath' );
var softParse = require( '../softParse' );
var _ = require( 'lodash' );

module.exports = override;

function override( req, res, next ) {

  // only override if we have a body
  if ( !res.body_ ) return next();

  var override = softParse( req.headers[ 'x-mock-override' ], {} );
  var data = res.body_;

  // apply jsonpath overrides
  _.each( override, function ( value, path ) {
    try {
      jsonpath.apply( data, path, function () {
        return value;
      } );
    } catch ( ex ) {
      console.log( ex.stack );
    }
  } );

  next();

}
