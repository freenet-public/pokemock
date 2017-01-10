var readFile = require( './readFile' );
var cluster = require( 'cluster' );
var minimist = require( 'minimist' );
var parser = require( 'json-schema-ref-parser' );
var assert = require( 'assert' );
var pack = require( '../package.json' );
var enableDestroy = require( 'server-destroy' );

module.exports = dispatch;

function dispatch( argv, createApp ) {

  var args = minimist( argv.slice( 0 ) );

  if ( args.h || args.help ) return usage();
  if ( args.v || args.version ) return version();
  if ( args._.length === 0 ) return usage();
  if ( ( args.w || args.watch ) && cluster.isMaster ) return watch();

  return serve( args, createApp );

}

function usage() {
  return readFile( __dirname + '/../README.md' ).then( function ( contents ) {
    console.log();
    console.log( contents.toString( 'utf-8' ).match( /```([\s\S]*?)```/ )[ 1 ].trim() );
  } );
}

function version() {
  return new Promise( function ( resolve ) {
    console.log( pack.version );
    resolve();
  } );
}

function watch() {
  return new Promise( function ( resolve ) {
    cluster.fork();
    cluster.on( 'exit', function ( worker ) {
      console.log( 'Worker ' + worker.process.pid + ' died. Restarting...');
      cluster.fork();
    } );
    resolve();
  } );
}

function serve( args, createApp ) {
  var swagger;
  return new Promise( function ( resolve ) {

    swagger = args._[ 0 ];
    if ( !swagger ) throw new Error( 'Missing Swagger file' );

    resolve( createApp( swagger, { killable: args.k || args.killable, static: args.static } ) );

  } ).then( function ( app ) {

    // parse port and use 8000 as default if no custom port is set.
    var port = parseInt( args.p || args.port || 8000 );

    app.server = app.listen( port, function () {
      console.log( 'Pokemock ready at http://localhost:' + port );
      console.log( 'Swagger UI at http://localhost:' + port + '/ui' );
      if ( args.k || args.killable ) console.log( 'Kill via http://localhost:' + port + '/kill' );
    } );

    enableDestroy( app.server );

    if ( args.w || args.watch ) poll( swagger );

  } );

}

function poll( swagger, current ) {

  parser.bundle( swagger ).then( function ( api ) {

    if ( current ) assert.deepEqual( api, current );

    current = api;

    setTimeout( function () {
      poll( swagger, current );
    }, 1000 );

  } ).catch( function () {
    process.exit( 1 );
  } );

}
