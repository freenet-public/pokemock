module.exports = status;

function status( req, res, next ) {

  var operation = req.swagger.operation;
  if ( !operation ) return next();

  var statuses = Object.keys( operation.responses );
  var status = req.headers[ 'x-mock-status' ] || statuses.sort( function ( a, b ) {
    if ( a === 'default' ) return 1;
    if ( b === 'default' ) return -1;
    return parseInt( a ) - parseInt( b );
  } )[ 0 ];

  var response = operation.responses[ status ];
  if ( !response ) {
    throw new Error( 'Invalid X-Mock-Status, valid are: ' + statuses );
  }

  res.status_ = status;
  res.schema = response.schema;
  res.examples = response.examples;

  next();

}
