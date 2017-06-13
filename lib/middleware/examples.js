var _ = require( 'lodash' );

module.exports = examples;

function examples() {

  return function ( req, res, next ) {

    if ( !res.schema ) return next();

    res.body_ = _.chain(req.swagger.operation.responses[res.status_])
      .get('examples')
      .toArray()
      .first()
      .value();

    next();

  };

}
