const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board_type', {
    bt_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bt_name: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'board_type',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bt_no" },
        ]
      },
    ]
  });
};
