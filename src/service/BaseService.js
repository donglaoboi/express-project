const md5 = require("md5");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { Op } = require("sequelize");
const CONFIG = require("../config/Config");

const User = require("../model/User");
const ErrorResponse = require("../helper/ErrorRespone");
const ultiFuntion = require("../utils/Function");

const HTTP = require("../config/HttpRequest");

class BaseService {
  async login(username, password) {
    try {
      const condition = {
        where: {
          username: username,
          isDeleted: 0,
        },
      };
      let user = await User.findOne(condition);
      if (!user) {
        throw new ErrorResponse(
          HTTP.STATUSCODE.UNAUTHORIZED,
          HTTP.MESSAGE.UNAUTHORIZED
        );
      } else if (md5(password) === user.password && user.status === 1) {
        let token = jwt.sign({ id: user.id }, process.env.PRIVATEKEY);
        return token;
      } else if (md5(password) === user.password && user.status === 0) {
        //let timevalid = parseInt(process.env.TIMEVALID);
        // user.verifyCodeValid = moment().local().add(timevalid, 'm');
        // await user.save();
        // let link = `${req.protocol}://${req.get('host')}/api/v1/users/verifyEmail/`;
        // ultiFuntion.sendMail(user, link);
        throw new ErrorResponse(
          HTTP.STATUSCODE.UNAUTHORIZED,
          HTTP.MESSAGE.USERNOTVERIFY
        );
      } else {
        throw new ErrorResponse(
          HTTP.STATUSCODE.UNAUTHORIZED,
          HTTP.MESSAGE.UNAUTHORIZED
        );
      }
    } catch (error) {
      throw new ErrorResponse(
        HTTP.STATUSCODE.UNAUTHORIZED,
        HTTP.MESSAGE.UNAUTHORIZED
      );
    }
  }

  async resendEMail(req, username, email) {
    const condition = {
      where: {
        username: username,
        email: email,
        isDeleted: 0,
      },
    };
    let user = await User.findOne(condition);
    if (!user) {
      throw new ErrorResponse(
        HTTP.STATUSCODE.UNAUTHORIZED,
        HTTP.MESSAGE.UNAUTHORIZED
      );
    }
    if (user.status === 1) {
      throw new ErrorResponse(
        HTTP.STATUSCODE.BADREQUEST,
        HTTP.ERRORCODE.USERISVERIFY
      );
    }
    let timevalid = parseInt(process.env.TIMEVALID);
    user.verifyCodeValid = moment().local().add(timevalid, "m");
    await user.save();
    let link = `${req.protocol}://${req.get("host")}/api/v1/users/verifyEmail/`;
    ultiFuntion.sendMail(user, link);
  }

  async getList(Model, offset, limit, sort, pageIndex, pageSize) {
    try {
      const condition = {
        order: [["createdAt", sort]],
        where: {
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
      throw new ErrorResponse(
        HTTP.STATUSCODE.BADREQUEST,
        HTTP.ERRORCODE.BADREQUEST
      );
    }
  }

  async update(Model, id, data) {
    try {
      const condition = {
        where: { id: id },
      };
      await Model.update(data, condition);
    } catch (error) {
      throw new ErrorResponse(
        HTTP.STATUSCODE.BADREQUEST,
        HTTP.ERRORCODE.BADREQUEST
      );
    }
  }

  async delete(Model, id, username) {
    let data = {
      updateBy: username,
      isDeleted: 1,
    };
    try {
      const condition = {
        where: { id: id },
      };
      await Model.update(data, condition);
    } catch (error) {
      throw new ErrorResponse(
        HTTP.STATUSCODE.BADREQUEST,
        HTTP.ERRORCODE.DELETEFAIL
      );
    }
  }

  async create(Model, data) {
    try {
      let model = await Model.create(data);
      return model;
    } catch (error) {
      throw new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message);
    }
  }

  async fillter(Model, offset, limit, sort, pageIndex, pageSize, q) {
    try {
      const condition = {
        order: [["createdAt", sort]],
        where: {
          name: {
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

module.exports = new BaseService();
