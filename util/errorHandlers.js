exports.notFound = ( req, res, next ) => {
  const err = new Error( "Not Found" );
  err.status = 404;
  next( err );
};

exports.developmentErrors = ( err, req, res, next ) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message         : err.message,
    status          : err.status,
    stackHighlighted: err.stack.replace( /[a-z_-\d]+.js:\d+:\d+/gi, "<mark>$&</mark>" ),
    title           : "Error",
  };
  res.status( err.status || 500 );
  res.format( {
    "text/html": () => {
      res.render( "error", errorDetails );
    },
    "application/json": () => res.json( errorDetails ),
  } );
};

exports.productionErrors = ( err, req, res, next ) => {
  res.status( err.status || 500 );
  res.render( "error", {
    title  : "Error",
    status : "Error",
    message: err.message,
  } );
};
