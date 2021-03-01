const { Sequelize } = require( "sequelize" );

module.exports = async function configureDatabase( env ) {
  const sequelize = new Sequelize( env.MYSQL_DB, env.MYSQL_USER, env.MYSQL_PASS, {
    host           : env.MYSQL_HOST,
    dialect        : "mariadb",
    logging        : env.NODE_ENV === "prod" ? false : console.log,
    skipSetTimezone: true,
  } );

  // test db connection
  sequelize.authenticate().catch( err => {
    console.error( "Unable to connect to the database" );
    process.exit( 1 );
  } );

  return sequelize;
};
