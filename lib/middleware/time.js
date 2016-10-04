module.exports = time;

// delay request by time specified in header
function time( req, res, next ) {
  var time = parseInt( req.headers[ 'x-mock-time' ] || 1 );
  setTimeout( next, time );
}
