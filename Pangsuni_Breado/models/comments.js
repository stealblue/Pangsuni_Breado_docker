const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comments', {
    c_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    b_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'board',
        key: 'b_no'
      }
    },
    u_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'u_no'
      }
    },
    c_content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    c_reg_dt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    c_mod_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "c_no" },
        ]
      },
      {
        name: "u_no",
        using: "BTREE",
        fields: [
          { name: "u_no" },
        ]
      },
      {
        name: "b_no",
        using: "BTREE",
        fields: [
          { name: "b_no" },
        ]
      },
    ]
  });
};
