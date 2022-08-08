const moment = require("moment");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const User = require("../model/User");
const Role = require("../model/Role");
const UserRole = require("../model/UserRole");

const ErrorResponse = require("../helper/ErrorRespone");
const HTTP = require("../config/HttpRequest");
const sequelize = require("../config/Database");
const CONFIG = require("../config/Config");

class UserService {
  async createUser(data) {
    const t = await sequelize.transaction();
    try {
      const condition = { transaction: t };
      const condition1 = {
        where: { name: "customer" },
        transaction: t,
      };
      let user = await User.create(data, condition);
      let role = await Role.findOne(condition1);
      let userRoleData = {
        userid: user.id,
        roleid: role.id,
      };
      await UserRole.create(userRoleData, condition);
      t.commit();
      return user;
    } catch (error) {
      t.rollback();
      throw new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message);
    }
  }

  async verifyEmail(token) {
    const t = await sequelize.transaction();
    let data = jwt.verify(token, process.env.PRIVATEKEY);
    const { id, verifyCode } = data;
    try {
      const condition = {
        where: { id: id },
        transaction: t,
      };
      const condition1 = {
        transaction: t,
      };
      let user = await User.findOne(condition);
      if (user.verifyCode !== verifyCode) {
        throw new ErrorResponse(
          HTTP.STATUSCODE.BADREQUEST,
          HTTP.MESSAGE.YOURACCOUNTISCONFIG
        );
      }
      if (moment().local().isBefore(user.verifyCodeValid)) {
        user.status = 1;
        user.verifyCode = null;
        user.verifyCodeValid = null;
        await user.save(condition1);
        t.commit();
      } else {
        throw new ErrorResponse(
          HTTP.STATUSCODE.BADREQUEST,
          HTTP.MESSAGE.VERIFYCODEISVALID
        );
      }
    } catch (error) {
      t.rollback();
      throw new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message);
    }
  }

  async getDetail(id) {
    try {
      const condition = {
        include: {
          model: UserRole,
          include: {
            model: Role,
          },
        },
        where: { id: id },
      };
      let user = await User.findOne(condition);
      if (!user) {
        throw new ErrorResponse(
          HTTP.STATUSCODE.BADREQUEST,
          HTTP.ERRORCODE.NOTFOUND
        );
      }
      return user;
    } catch (error) {
      throw new ErrorResponse(
        HTTP.STATUSCODE.BADREQUEST,
        HTTP.MESSAGE.BADREQUEST
      );
    }
  }

  async fillter(Model, offset, limit, sort, pageIndex, pageSize, q) {
    try {
      const condition = {
        order: [["createdAt", sort]],
        where: {
          username: {
            [Op.substring]: q,
          },
          isDeleted: 0,
        },
        offset: offset,
        limit: limit,
      };
      const { count, rows } = await Model.findAndCountAll(condition);
      const totalPage = Math.ceil(count / CONFIG.INDEX.PAGESIZE);
      return {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalSize: rows.length,
        totalPage: totalPage,
        count: count,
        rows: rows,
      };
    } catch (error) {
      throw new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message);
    }
  }
}

module.exports = new UserService();
