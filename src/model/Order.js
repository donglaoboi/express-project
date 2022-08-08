const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Voucher = require('./Voucher');
const STATUSORDER = require('../config/config').STATUSODER;

const Order = sequelize.define('orders', {
  id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  voucherid: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  orderCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orderStatus: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: STATUSORDER.CREATE
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

User.hasMany(Order, {
  foreignKey: {
    name: 'userid',
    allowNull: false
  }
})
Order.belongsTo(User, {
  foreignKey: {
    name: 'userid',
    allowNull: false
  }
})

Voucher.hasMany(Order, { foreignKey: 'voucherid' })
Order.belongsTo(Voucher, { foreignKey: 'voucherid' })

module.exports = Order;
