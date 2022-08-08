const { DataTypes } = require("sequelize");
const sequelize = require("../config/Database");
const User = require("./User");
const Role = require("./Role");

const UserRole = sequelize.define(
  "userroles",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roleid: {
      type: DataTypes.UUID,
      allowNull: false,
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
    indexes: [{ unique: true, fields: ["userid", "roleid"] }],
  }
);

User.hasMany(UserRole, { foreignKey: "userid" });
UserRole.belongsTo(User, { foreignKey: "userid" });

Role.hasMany(UserRole, { foreignKey: "roleid" });
UserRole.belongsTo(Role, { foreignKey: "roleid" });

module.exports = UserRole;
