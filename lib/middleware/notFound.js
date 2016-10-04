module.exports = notFound;

function notFound( req, res, next ) {

    var err = new Error( 'Not found. Pika pika?' );
    err.status = 404;
    next( err );

}
