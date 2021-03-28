const express = require( "express" );
const { render } = require( "pug" );
const router = express.Router();

const { checkAuthenticated, checkNotAuthenticated, returnAuthentication } = require( "../util/passportUtil" );

router.use( returnAuthentication );

router.get( "/", checkNotAuthenticated, ( req, res ) => res.render( "landing", { title: "What to do?" } ) );
router.get( "/login", checkNotAuthenticated, ( req, res ) => res.render( "login", { title: "login" } ) );
router.get( "/register", checkNotAuthenticated, ( req, res ) => res.render( "register", { title: "register" } ) );
router.get( "/app", checkAuthenticated, ( req, res ) => res.render( "app", { title: "App" } ) );
router.get( "/manager", checkAuthenticated, ( req, res ) => res.render( "manager", { title: "profile-manager" } ) );

router.get( "/app/todo/:todoId", ( req, res ) => {
  const { todoId } = req.params;
  if ( !todoId )
    return res.redirect( "/app" );

  req.models.Todo.findAll( { where: { id: todoId } } )
    .then( todos => {
      if ( todos[0] )
        res.render( "todo", { title: "Todo", todo: todos[0] } )
      else
        res.redirect( "/app" );
    } )
    .catch( err => res.redirect( "/app" ) );
} );

module.exports = router;
