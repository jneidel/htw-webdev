module.exports = ( err, req, res, next ) => {
  let errorMsg = err.message.split( ":" ); // format: '400: msg'
  const errorCode = errorMsg.length > 1 ? Number( errorMsg.shift() ) || 500 : 500;
  errorMsg = errorMsg.join( ":" ).trim();
  console.error( `${errorCode} ${req.method} /api${req.url} - ${errorMsg}` );

  res.status( errorCode ).json( { error: true, errorMsg } );
};
