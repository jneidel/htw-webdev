const express = require( "express" );
const router = express.Router();

// /api routes
router.get( "/", ( req, res ) => {
  res.send( 200 );
} );
router.get( "/:anything", ( req, res ) => {
  res.send( 200 );
} );

module.exports = router;
