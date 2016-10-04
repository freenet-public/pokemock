var Chance = require( 'chance' );

module.exports = chance;

// add (seeded) chance object to the current request
function chance( req, res, next ) {

  var seed = req.headers[ 'x-mock-seed' ] || ( new Chance() ).word();
  req.chance = new Chance( [
    seed,
    JSON.stringify( req.pathParams ),
    JSON.stringify( req.query ),
    req.body
  ].join( '' ) );

  // always send current seed back to client
  res.set( 'X-Mock-Seed', seed );

  next();

}
