module.exports = kill;

// kill endpoint, sometimes handy for stopping a service
function kill( req, res, next ) {
  res.json( { 'ciao': true } );
  req.server.destroy();
}
