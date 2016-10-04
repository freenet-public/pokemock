module.exports = softParse;

function softParse( x, def ) {
  if ( typeof x === 'object' && x !== null ) return x;

  try {
    return JSON.parse( x );
  } catch ( ex ) {
    return def;
  }
}
