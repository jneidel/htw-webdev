const express = require( "express" );
const router = express.Router();

router.get( "/", ( req, res ) => res.render( "landing" ) );
router.get( "/welcome", ( req, res ) => res.render( "welcome", { title: "wd-todo" } ) );

module.exports = router;
