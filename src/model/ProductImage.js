const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product')

const ProductImage = sequelize.define('productimages', {
  id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  productid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
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

Product.hasMany(ProductImage, { foreignKey: 'productid' });
ProductImage.belongsTo(Product, { foreignKey: 'productid' });

module.exports = ProductImage;
