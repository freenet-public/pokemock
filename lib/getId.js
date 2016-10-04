var getIdProperty = require( './getIdProperty' );

module.exports = getId;

// try to infer the primary id of an object
// optionally use schema as hint
function getId( object, schema ) {
  var prop = getIdProperty( object, schema );
  return prop ? object[ prop ] : null;
}
