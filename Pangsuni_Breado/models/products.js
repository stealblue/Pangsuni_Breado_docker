const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    p_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    p_name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    p_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    p_desc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    s_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 's_no'
      }
    },
    p_img: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "p_no" },
        ]
      },
      {
        name: "s_no",
        using: "BTREE",
        fields: [
          { name: "s_no" },
        ]
      },
    ]
  });
};
