var express = require( 'express' );

// render pokemock specific swagger ui
module.exports = express.Router().use(
  express.static( __dirname + '/../../public' ),
  express.static( __dirname + '/../../node_modules/swagger-ui/dist' )
);
