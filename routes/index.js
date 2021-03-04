const express = require( "express" );
const router = express.Router();

const passport_config = require( "../util/passportUtil" );
const { checkAuthenticated, checkNotAuthenticated } = passport_config;

router.use( passport_config.returnAuthentication );

router.get( "/", ( req, res ) => res.render( "landing", { title: "What to do?" } ) );
router.get( "/login", checkNotAuthenticated, ( req, res ) => res.render( "login", { title: "login" } ) );
router.get( "/register", checkNotAuthenticated, ( req, res ) => res.render( "register", { title: "register" } ) );
router.get( "/home", checkAuthenticated, ( req, res ) => res.render( "home", { title: "home" } ) );
router.get( "/app", ( req, res ) => res.render( "app", { title: "App" } ) );

module.exports = router;
