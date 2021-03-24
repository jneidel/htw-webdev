const express = require( "express" );
const router = express.Router();
const bcrypt = require( "bcrypt" );
const passport = require( "passport" );

const passport_config = require( "../util/passportUtil" );
const { checkNotAuthenticated } = passport_config;
const randomColor = require( "../util/randomColor" );

router.post( "/login", passport.authenticate( "local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash   : true,
} ) );

router.post( "/register", checkNotAuthenticated, async ( req, res ) => {
  try {
    const user = await req.models.User.findOne(
      {
        where: { username: req.body.username },
        raw  : true,
      }
    );
    if ( user == null ) {
      const hashedPassword = await bcrypt.hash( req.body.password, 10 );
      req.models.User.create( {
        username: req.body.username,
        password: hashedPassword,
      } );
      res.redirect( "/login" );
    } else {
      req.flash( "error", "Username already taken!" );
      res.redirect( "/register" );
    }
  } catch {
    res.redirect( "/register" );
  }
} );

router.post( "/logout", ( req, res ) => {
  req.logOut();
  res.redirect( "/login" );
} );

// todo crud
router.route( "/todos" )
  .get( ( req, res, next ) => {
    const { listId } = req.query;

    if ( !listId )
      return next( new Error( "400: missing listId" ) );


    req.models.Todo.findAll( {
      where     : { ListId: listId },
      attributes: [ "id", "text", "createdAt", "done" ],
      order     : [ [ "createdAt", "DESC" ] ],
    } )
      .then( todos => res.json( { error: false, todos } ) )
      .catch( err => next( err ) );
  } )
  .delete( ( req, res, next ) => {
    // delete all done todos
    req.models.Todo.destroy( { where: { done: true } } )
      .then( () => res.json( { error: false } ) )
      .catch( err => next( err ) );
  } );

router.route( "/todo" )
  .post( ( req, res, next ) => {
    const { text, listId } = req.body;
    if ( !text )
      return next( new Error( "400: empty todo text" ) );
    if ( !listId )
      return next( new Error( "400: no listId (reference to lists)" ) );

    req.models.Todo.create( { text, ListId: listId } )
      .then( todo => res.json( { error: false, id: todo.id } ) )
      .catch( err => {
        if ( err.message.match( "foreign key constraint fails" ) )
          return next( new Error( "400: listId is invalid (not a foreign key)" ) );


        return next( err );
      } );
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

// lists crud
router.get( "/lists", async ( req, res, next ) => {
  const lists = await req.models.List.findAll( {
    attributes: [ "id", "name", "color", "createdAt" ],
    order     : [ [ "createdAt", "ASC" ] ],
  } ).catch( err => next( err ) );

  if ( lists.length === 0 ) {
    req.models.List.create( { name: "default", color: "#000000" } ) // TODO: add UserId: user
      .then( list => res.json( { error: false, todos: [], lists: [ list ] } ) )
      .catch( err => next( err ) );
  } else { // no list = no todo, so no need to query
    req.models.Todo.findAll( {
      where     : { ListId: lists[0].id },
      attributes: [ "id", "text", "done", "createdAt" ],
      order     : [ [ "createdAt", "DESC" ] ],
    } )
      .then( todos => res.json( { error: false, todos, lists } ) )
      .catch( err => next( err ) );
  }
} );

router.route( "/list" )
  .post( ( req, res, next ) => {
    // const { name, color } = req.body;
    // if ( !name )
    //   return next( new Error( "400: no list name" ) );
    // if ( !color )
    //   return next( new Error( "400: no list color" ) );
    // if ( color.length !== 7 || color[0] !== "#" )
    //   return next( new Error( "400: invalid hex color (#rrggbb)" ) );

    req.models.List.create( { name: "new list", color: randomColor() } )
      .then( list => res.json( { error: false, id: list.id, name: list.name, color: list.color } ) )
      .catch( err => next( err ) );
  } )
  .put( ( req, res, next ) => {
    const { id, name, color } = req.body;
    if ( !id )
      return next( new Error( "400: missing list id" ) );
    if ( color ) {
      if ( color.length !== 7 || color[0] !== "#" )
        return next( new Error( "400: invalid hex color (#rrggbb)" ) );
    }
    if ( name === undefined && color === undefined )
      return next( new Error( "400: nothing to update" ) );

    const updateObj = {};
    if ( color !== undefined )
      updateObj.color = color;
    if ( name !== undefined )
      updateObj.name = name;

    req.models.List.update( updateObj, { where: { id } } )
      .then( () => res.json( { error: false } ) )
      .catch( err => next( err ) );
  } )
  .delete( ( req, res, next ) => {
    const { id } = req.body;
    if ( !id )
      return next( new Error( "400: missing list id" ) );

    req.models.List.destroy( { where: { id } } )
      .then( () => res.json( { error: false } ) )
      .catch( err => next( err ) );
  } );

module.exports = router;
