const express = require( "express" );
const router = express.Router();

router.get( "/", ( req, res ) => res.render( "landing", { title: "What to do?"} ) );
router.get( "/app", ( req, res ) => res.render( "app", { title: "App" } ) );

module.exports = router;
