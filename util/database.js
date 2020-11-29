const { Sequelize } = require( "sequelize" );

module.exports = async function configureDatabase( env ) {
  const sequelize = new Sequelize( "wd_todo", "jneidel", "", {
    host          : "localhost",
    dialect       : "mariadb",
    logging       : env.NODE_ENV === "prod" ? false : console.log,
    dialectOptions: {
      timezone: "Etc/GMT0", // suppress warning
    },
  } );

  // test db connection
  sequelize.authenticate().catch( err => {
    console.error( "Unable to connect to the database" );
    process.exit( 1 );
  } );

  return sequelize;
}
