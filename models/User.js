const { DataTypes } = require( "sequelize" );

module.exports = function User( db ) {
  return db.define( "User", {
    id: {
      type        : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey  : true,
      allowNull   : false,
    },
    username: {
      type     : DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type     : DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "users",
  } );
};