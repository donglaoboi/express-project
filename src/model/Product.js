const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  categoryid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priceImport: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  priceSelling: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  weight: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  quantityActual: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantityDisplay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
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

Category.hasMany(Product, { foreignKey: 'categoryid' });
Product.belongsTo(Category, { foreignKey: 'categoryid' });

module.exports = Product;
