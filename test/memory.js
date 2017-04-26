var createApp = require( '../createDefaultApp' );
var request = require( './request' );
var assert = require( 'assert' );

describe( 'The Pokemock server (with memory module)', function () {

  var url = 'http://localhost:7374';
  var server;
  var options = {
    json: true,
    headers: {
      api_key: 'siegmeyer'
    }
  };

  before( function () {
    server = createApp( 'test/petstore.json', { memory: true } ).listen( 7374 );
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

  after( function () {
    if ( server ) server.close();
  } );

} );
