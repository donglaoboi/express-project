const { DataTypes } = require("sequelize");
const sequelize = require("../config/Database");

const Role = sequelize.define(
  "roles",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discription: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Role;
