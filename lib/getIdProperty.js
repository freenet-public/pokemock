var _ = require( 'lodash' );
var levenshtein = require( 'fast-levenshtein' );

module.exports = getIdProperty;

// try to infer the primary id property of an object
// candidates must have "id" at the end
// shorter props are preferred
// if we know the schema definition name, candidates must be close enough to
// that definition, e.g. don't allow "contractId" to be the primary key of a
// "Customer" - it's more likely a foreign key
function getIdProperty( object, schema ) {

  var definition = schema && schema[ 'x-definition' ];
  var candidates = _.keys( object ).filter( function ( prop ) {
    return prop.match( /id$/i );
  } ).sort( function ( a, b ) {
    return a.length - b.length;
  } ).filter( function ( key ) {
    if ( definition && !key.match( /^.?id$/i ) ) {
      return levenshtein.get(
        definition.toLowerCase(),
        key.replace( /_?id$/i, '' ).toLowerCase()
      ) <= 2;
    }
    return true;
  } );

  return candidates[ 0 ];
}
