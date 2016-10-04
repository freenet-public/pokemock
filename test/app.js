var createApp = require( '../createDefaultApp' );
var request = require( './request' );
var assert = require( 'assert' );

describe( 'The Pokemock server', function () {

  var url = 'http://localhost:7373';
  var server;
  var options = {
    json: true,
    headers: {
      api_key: 'siegmeyer'
    }
  };

  before( function () {
    server = createApp( 'test/petstore.json' ).listen( 7373 );
  } );

  it( 'should handle unfound paths', function () {
    return request( url + '/siegmeyer', options ).then( function ( res ) {
      assert.ok( res.body.message.match( /not found/i ) );
      assert.equal( res.statusCode, 404 );
    } );
  } );

  it( 'should publish a Swagger UI', function () {
    return request( url + '/ui' ).then( function ( res ) {
      assert.equal( res.statusCode, 200 );
    } );
  } );

  it( 'should generate mock data', function () {
    return request( url + '/v2/pet/findByStatus?status=available' ).then( function ( res ) {
      assert.equal( res.statusCode, 200 );
    } );
  } );

  it( 'should remember generated objects by ID', function () {
    var customer;
    return request( url + '/v2/pet/5', options ).then( function ( res ) {
      assert.equal( res.statusCode, 200 );
      customer = res.body;
      return request( url + '/v2/pet/5', options );
    } ).then( function ( res ) {
      assert.deepEqual( res.body, customer );
    } );
  } );

  it( 'should delete objects by ID', function () {
    return request( url + '/v2/pet/6', options ).then( function ( res ) {
      assert.equal( res.statusCode, 200 );
      return request( url + '/v2/pet/6', {
        method: 'DELETE',
        api_key: 'siegmeyer'
      } );
    } ).then( function ( res ) {
      return request( url + '/v2/pet/6', options );
    } ).then( function ( res ) {
      assert.equal( res.statusCode, 404 );
    } );
  } );

  it.skip( 'should update objects by ID', function () {

  } );

  it( 'should create objects', function () {
    return request( url + '/v2/pet', {
      method: 'POST',
      body: {
        "id": 4,
        "category": {
          "id": 78,
          "name": "string"
        },
        "name": "doggie",
        "photoUrls": [
          "string"
        ],
        "tags": [
          {
            "id": 97,
            "name": "string"
          }
        ],
        "status": "available"
      },
      json: true
    } ).then( function ( res ) {
      assert.equal( res.statusCode, 200 );
    } );
  } );

  it( 'should respond after a specified time', function () {

    this.timeout( 10000 );

    var t0 = Date.now();

    return request( url + '/v2/pet/4', {
      headers: {
        'X-Mock-Time': 1000,
        api_key: 'siegmeyer'
      },
      json: true
    } ).then( function ( res ) {
      var t1 = Date.now();
      assert.ok( t1 - t0 > 1000 );
    } );
  } );

  it( 'should replay X-Mock-* headers', function () {
    return request( url + '/v2/pet/4', {
      headers: {
        'X-Mock-Replay': 3,
        'X-Mock-Status': 404,
        api_key: 'siegmeyer'
      },
      json: true
    } ).then( function ( res ) {
      assert.equal( res.statusCode, 404 );
    } ).then( function () {
      return request( url + '/v2/pet/4', options );
    } ).then( function ( res ) {
      assert.equal( res.statusCode, 404 );
    } ).then( function () {
      return request( url + '/v2/pet/4', options );
    } ).then( function ( res ) {
      assert.equal( res.statusCode, 404 );
    } ).then( function () {
      return request( url + '/v2/pet/4', options );
    } ).then( function ( res ) {
      assert.equal( res.statusCode, 404 );
    } ).then( function () {
      return request( url + '/v2/pet/4', options );
    } ).then( function ( res ) {
      assert.equal( res.body.id, '4' );
      assert.equal( res.statusCode, 200 );
    } );
  } );

  after( function () {
    if ( server ) server.close();
  } );

} );
