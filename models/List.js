const { DataTypes } = require( "sequelize" );

module.exports = function List( db, User ) {
  return db.define( "List", {
    id: {
      type        : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey  : true,
      allowNull   : false,
    },
    name: {
      type     : DataTypes.STRING,
      allowNull: false,
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
