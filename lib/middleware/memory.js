var _ = require( 'lodash' );
var getId = require( '../getId' );
var setId = require( '../setId' );
var mock = require( './mock' );

module.exports = memory;

// remembers generated responses by ID
function memory(options) {

  var objects = {};

  return handle;

  function handle( req, res, next ) {

    if ( options.static || res.status_ >= 300 || req.headers[ 'x-mock-memory' ] + '' === '0' ) {
      return next();
    }

    try {
      // get data from status, mock, and classify middlewares
      var data = res.body_;
      var random = res.body_;
      var schema = res.schema;
      var action = req.action;

      // use memory
      switch ( action.type ) {
      case 'get':
        data = load( schema, data );
        store( schema, data );
        break;
      case 'getById':
        data = load( schema, { id: action.id, __memory: true } );
        if ( data ) {
          if ( data.__memory ) {
            setId( random, data.id, schema );
            data = random;
          }
          store( schema, data );
        } else {
          data = 'deleted';
        }
        break;
      case 'delete':
      case 'deleteById':
        remove( action.id );
        break;
      case 'updateById':
        data = update( action.id, action.body );
        store( action.bodySchema, data );
        break;
      case 'create':
        store( action.bodySchema, data );
        data = update( getId( data ), action.body );
        store( action.bodySchema, data );
        break;
      default:
        // ignore
      }

      if ( data === 'deleted' ) {
        return res.status( 404 ).json( {
          pokemockError: 'Unknown entity'
        } );
      }

      res.body_ = data;

    } catch ( ex ) {
      // don't die on memory issues
      console.log( ex.stack );
    }

    next();

  }

  // remember given data
  function store( schema, data ) {

    var type = data && ( schema.type || 'object' );

    switch ( type ) {

    case 'object':
      var id = getId( data );
      if ( id ) objects[ id ] = data;
      _.forEach( schema.properties, function ( schema, name ) {
        store( schema, data[ name ] );
      } );
      return this;

    case 'array':
      data.forEach( function ( item ) {
        store( schema.items, item );
      } );
      return this;

    default:
      return this;

    }

  }

  // load known data into given data
  function load( schema, data ) {

    var type = data && ( schema.type || 'object' );

    switch ( type ) {

    case 'object':
      // load known object or null
      var id = getId( data );
      if ( id && objects[ id ] === 'deleted' ) return null;
      if ( id && objects[ id ] ) data = objects[ id ];

      if ( !data.__memory ) _.forEach( schema.properties, function ( schema, name ) {
        data[ name ] = load( schema, data[ name ] );
      } );

      return data;

    case 'array':
      // filter deleted objects
      // otherwise load known data
      return data.filter( function ( item ) {
        var id = getId( item );
        return !id || objects[ id ] !== 'deleted';
      } ).map( function ( item ) {
        return load( schema.items, item );
      } );

    default:
      return data;

    }
  }

  function update( id, data ) {
    if ( objects[ id ] === 'deleted' ) return 'deleted';
    return _.assign( objects[ id ] || {}, data );
  }

  // remember that an object was deleted
  function remove( id ) {
    objects[ id ] = 'deleted';
  }

}
