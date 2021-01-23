const express = require( "express" );
const router = express.Router();

// todo crud
router.get( "/todos", ( req, res, next ) => {
  req.models.Todo.findAll( {
    attributes: [ "id", "text", "createdAt", "done" ],
  } )
    .then( todos => res.json( { error: false, todos } ) )
    .catch( err => next( err ) );
} );

router.route( "/todo" )
  .post( ( req, res, next ) => {
    const { text } = req.body;
    if ( !text )
      return next( new Error( "400: empty todo text" ) );

    req.models.Todo.create( { text } )
      .then( todo => res.json( { error: false, id: todo.id } ) )
      .catch( err => next( err ) );
  } )
  .put( ( req, res, next ) => {
    const { id, text, done } = req.body;
    if ( !id )
      return next( new Error( "400: missing todo id" ) );
    if ( text === "" )
      return next( new Error( "400: empty todo text" ) );
    if ( text === undefined && done === undefined )
      return next( new Error( "400: nothing to update" ) );

    const updateObj = {};
    if ( text !== undefined )
      updateObj.text = text;
    if ( done !== undefined )
      updateObj.done = done;

    req.models.Todo.update( updateObj, { where: { id } } )
      .then( () => res.json( { error: false } ) )
      .catch( err => next( err ) );
  } )
  .delete( ( req, res, next ) => {
    const { id } = req.body;
    if ( !id )
      return next( new Error( "400: missing todo id" ) );

    req.models.Todo.destroy( { where: { id } } )
      .then( () => res.json( { error: false } ) )
      .catch( err => next( err ) );
  } );

module.exports = router;
