var _ = require( 'lodash' );

module.exports = replay;

function replay() {

  var recorded = [];

  return function ( req, res, next ) {

    try {
      // add recorded request
      var times = parseInt( req.headers[ 'x-mock-replay' ] || 0 );
      var pattern = req.headers[ 'x-mock-replay-pattern' ];

      for ( var i = 0; i < times; ++i ) {
        recorded.push( {
          pattern: new RegExp( pattern || _.escapeRegExp( req.originalUrl ) ),
          headers: _.pickBy( req.headers, replayable )
        } );
      }

      if ( times === 0 ) {
        // get first matching recorded request, if any, and apply
        for ( var j = 0; j < recorded.length; ++j ) {
          if ( req.originalUrl.match( recorded.pattern ) ) {
            _.assign( req.headers, recorded[ j ].headers );
            recorded.splice( j, 1 );
            break;
          }
        }
      }
    } catch ( ex ) {
      console.log( ex.stack );
    }

    next();

  };

}

function replayable( value, header ) {
  return header.match( /^x-mock/ ) && !header.match( /^x-mock-replay/ );
}
