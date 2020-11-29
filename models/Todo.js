const { DataTypes } = require( "sequelize" );

module.exports = function Todo( db ) {
  return db.define( "Todo", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    // mangaged by Sequelize as createdAt
    // date: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    //   allowNull: false
    // },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: "todos",
  } );
}
