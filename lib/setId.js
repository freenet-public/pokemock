var getIdProperty = require( './getIdProperty' );

module.exports = setId;

// try to set the primary id of an object
// optionally use schema as hint
function setId( object, id, schema ) {
  var prop = getIdProperty( object, schema );
  if ( prop ) object[ prop ] = id;
}
