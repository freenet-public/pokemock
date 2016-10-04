module.exports = {

  birthday: match( /dayofbirth|birthday/i, function ( chance, schema ) {
    var date = chance.birthday( { type: 'adult' } );
    return schema.format === 'date-time' ? date.toISOString() : date.toISOString().substr( 0, 10 );
  } ),

  email: match( /e?mail/i, function ( chance ) {
    return chance.email();
  } ),

  url: match( /homepage|urls?$/i, function ( chance ) {
    return chance.url();
  } ),

  first: match( /forename|firstname/i, function ( chance ) {
    return chance.first();
  } ),

  last: match( /lastname|surname/i, function ( chance ) {
    return chance.last();
  } ),

  country: match( /country$/i, function ( chance ) {
    return chance.country();
  } ),

  city: match( /city$/i, function ( chance ) {
    return chance.city();
  } ),

  street: match( /street$/i, function ( chance ) {
    return chance.street();
  } ),

  zip: match( /zip/i, function ( chance ) {
    return chance.zip();
  } ),

  houseNo: match( /houseNo/i, function ( chance ) {
    return chance.integer( { min: 1, max: 300 } ) + '';
  } ),

  prefix: match( /prefix|salutation/i, function ( chance ) {
    return chance.prefix();
  } ),

  description: match( /description$/i, function ( chance ) {
    return chance.paragraph( { sentences: 6 } );
  } ),

  summary: match( /summary$/i, function ( chance ) {
    return chance.paragraph( { sentences: 3 } );
  } ),

  label: match( /label$/i, function ( chance ) {
    return chance.sentence();
  } ),

  price: match( /(cost|price)$/i, function ( chance ) {
    return chance.dollar().substr( 1 );
  } ),

  phone: match( /phone/i, function ( chance ) {
    return chance.phone();
  } )

};

function match( pattern, fn ) {
  return function ( name, schema, options ) {
    if ( schema.type === 'string' && name.match( pattern ) ) {
      return fn( options.chance, schema );
    }
  };
}
