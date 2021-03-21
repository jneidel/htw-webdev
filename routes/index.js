const express = require( "express" );
const { render } = require("pug");
const router = express.Router();

const passport_config = require( "../util/passportUtil" );
const { checkAuthenticated, checkNotAuthenticated, returnAuthentication } = passport_config;

router.use( returnAuthentication );

router.get( "/", ( req, res ) => res.render( "landing", { title: "What to do?" } ) );
router.get( "/login", checkNotAuthenticated, ( req, res ) => res.render( "login", { title: "login" } ) );
router.get( "/register", checkNotAuthenticated, ( req, res ) => res.render( "register", { title: "register" } ) );
router.get( "/app", ( req, res ) => res.render( "app", { title: "App" } ) );
router.get( "/manager", checkAuthenticated, (req, res) => res.render("manager", {title: "profile-manager"}));

module.exports = router;
