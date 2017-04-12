var _ = require( 'lodash' );

// TODO candidate for separate module

module.exports = swaggerMin;

function swaggerMin( api ) {

  return _.assign(
    toRef( api, api.definitions, 0 ),
    { definitions: toRef( api.definitions, api.definitions, 2 ) }
  );

}

function toRef( value, definitions, level ) {

  var ref;

  if ( level <= 0 ) {
    _.forEach( definitions, function ( definition, name ) {
      if ( value === definition ) ref = name;
    } );
  }

  if ( ref ) {
    return { $ref: '#/definitions/' + ref };
  } else if ( Array.isArray( value ) ) {
    return value.map( function ( v ) {
      return toRef( v, definitions, level - 1 );
    } );
  } else if ( typeof value === 'object' && value ) {
    return _.mapValues( value, function ( v ) {
      return toRef( v, definitions, level - 1 );
    } );
  } else {
    return value;
  }

}
