const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('categorys', {
  id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER(2),
    allowNull: false,
    defaultValue: 1,
  },
  isDeleted: {
    type: DataTypes.INTEGER(1),
    allowNull: false,
    defaultValue: 0
  },
  createBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updateBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
})

module.exports = Category;
