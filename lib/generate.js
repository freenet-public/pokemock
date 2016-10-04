var _ = require( 'lodash' );

module.exports = {

  id: function ( name, schema, options ) {
    if ( schema.type === 'string' && name.match( /id$/i ) ) {
      return options.chance.guid();
    }
  },

  string: function ( name, schema, options ) {

    if ( schema.type !== 'string' ) return;

    // pick one random element from an enum
    if ( schema.enum ) {
      return options.chance.pickone( schema.enum );
    }

    // when no typehints are found, try to generate meaningful data
    // based on 'format'
    switch ( schema.format ) {
      case 'date':
        return options.chance.date().toISOString().substr( 0, 10 );
      case 'date-time':
        return options.chance.date().toISOString();
      case 'number':
        return options.chance.floating() + '';
      default:
        return options.chance.word();
    }

  },

  number: function ( name, schema, options ) {

    if ( schema.type !== 'number' ) return;

    // supported formats are 'float' and 'double'
    // but both are the same in javascript
    return options.chance.floating();

  },

  integer: function ( name, schema, options ) {
    if ( schema.type !== 'integer' ) return;
    return options.chance.integer( { min: 0, max: 4096 } );
  },

  boolean: function ( name, schema, options ) {
    if ( schema.type !== 'boolean' ) return;
    return options.chance.bool();
  },

  array: function ( name, schema, options, gen, depth ) {

    if ( schema.type !== 'array' ) return;

    if ( depth > options.maxDepth ) {
      return [];
    }

    var limit = options.limits[ schema.items[ 'x-definition' ] ] ||
      options.limits[ name ];

    var length = limit >= 0 ? limit : options.chance.integer( { min: 1, max: 5 } );
    var array = [];

    for ( var i = 0; i < length; ++i ) {
      array.push( gen( name, schema.items, options, gen, depth + 1 ) );
    }

    return array;

  },

  object: function ( name, schema, options, gen, depth ) {

    if ( schema.type && schema.type !== 'object' ) return;

    if ( depth > options.maxDepth ) {
      return null;
    }

    var properties = schema.allOf ? _.sample(
      _.filter( schema.allOf, function ( data ) {
        return Object.keys( data ).length > 0;
      } )
    ).properties : schema.properties;

    var self = this;

    return _.mapValues( properties, function ( schema, name ) {
      return gen( name, schema, options, gen, depth + 1 );
    } );

  }

};
