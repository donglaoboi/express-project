const { DataTypes } = require("sequelize");
const sequelize = require("../config/Database");
const Role = require("./Role");

const RoleModule = sequelize.define(
  "rolemodules",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    roleid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isCanRead: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isCanEdit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isCanAdd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isCanDelete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    api: {
      type: DataTypes.STRING,
      allowNull: false,
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

Role.hasMany(RoleModule, { foreignKey: "roleid" });
RoleModule.belongsTo(Role, { foreignKey: "roleid" });

module.exports = RoleModule;
