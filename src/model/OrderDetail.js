const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Order = require('./Order');

const OrderDetail = sequelize.define('orderdetails', {
  id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  orderid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  tax: {
    type: DataTypes.DOUBLE,
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
  indexes: [{ unique: true, fields: ['productid', 'orderid'] }]
})

Order.hasMany(OrderDetail, { foreignKey: 'orderid' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderid' });

Product.hasMany(OrderDetail, { foreignKey: 'productid' });
OrderDetail.belongsTo(Product, { foreignKey: 'productid' });

module.exports = OrderDetail;
