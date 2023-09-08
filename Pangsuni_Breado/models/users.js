const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    u_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    u_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "u_id"
    },
    u_name: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    u_pwd: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    u_tel: {
      type: DataTypes.CHAR(13),
      allowNull: false,
      unique: "u_tel"
    },
    u_email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: "u_email"
    },
    u_grade: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "일반회원"
    },
    u_reg_dt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    u_mod_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    u_done: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "u_no" },
        ]
      },
      {
        name: "u_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "u_id" },
        ]
      },
      {
        name: "u_tel",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "u_tel" },
        ]
      },
      {
        name: "u_email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "u_email" },
        ]
      },
    ]
  });
};
