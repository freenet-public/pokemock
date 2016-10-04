module.exports = send;

function send( req, res, next ) {
  if ( res.status_ ) res.status( res.status_ );
  if ( res.body_ ) res.json( res.body_ );
  if ( !res.status_ && !res.body_ ) next();
  if ( res.status_ ) res.end();
}
