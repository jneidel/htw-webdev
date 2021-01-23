const { DataTypes } = require( "sequelize" );

module.exports = function Todo( db ) {
  return db.define( "Todo", {
    id: {
      type        : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey  : true,
      allowNull   : false,
    },
    text: {
      type     : DataTypes.STRING,
      allowNull: false,
    },
    done: {
      type        : DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull   : false,
    },
    // date mangaged by Sequelize as createdAt
  }, {
    tableName: "todos",
  } );
};
