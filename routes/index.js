const express = require( "express" );
const router = express.Router();

router.get( "/", ( req, res ) => res.render( "landing", { title: "What to do?"} ) );
router.get( "/welcome", ( req, res ) => res.render( "welcome", { title: "wd-todo" } ) );
router.get( "/login", ( req, res ) => res.render( "login", { title: "login" } ) );

module.exports = router;
