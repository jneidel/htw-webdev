const { DataTypes } = require( "sequelize" );

module.exports = function List( db ) {
  return db.define( "List", {
    id: {
    name: {
      type        : DataTypes.STRING,
      primaryKey  : true,
      allowNull   : false,
    },
    color: {
      type     : DataTypes.STRING,
      allowNull: false,
      // random color gets rolled on client
    },
  }, {
    tableName: "lists",
  } );
};
