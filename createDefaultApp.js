var express = require( 'express' );
var pokemock = require( './' );
var generate = pokemock.generate;
var generate2 = pokemock.generate2;

module.exports = createDefaultApp;

function createDefaultApp( api, options ) {

  options = options || {};
  var app = express();

  app.get( '/api-docs', pokemock.apiDocs( api ) );
  app.use( '/ui', pokemock.ui );

  if ( options.killable ) app.use( '/kill', pokemock.kill );

  app.use(
    pokemock.swagger( api, app ),
    pokemock.replay(),
    pokemock.chance,
    pokemock.time,
    pokemock.status,
    pokemock.mock( [
      generate.id,
      generate2.birthday,
      generate2.email,
      generate2.url,
      generate2.phone,
      generate2.city,
      generate2.country,
      generate2.street,
      generate2.zip,
      generate2.houseNo,
      generate2.prefix,
      generate2.first,
      generate2.last,
      generate2.description,
      generate2.summary,
      generate2.label,
      generate2.price,
      generate.string,
      generate.number,
      generate.integer,
      generate.boolean,
      generate.array,
      generate.object
    ], options.static ),
    pokemock.override,
    pokemock.classify,
    pokemock.memory( options ),
    pokemock.send,
    pokemock.notFound,
    pokemock.sendError
  );

  return app;

}
