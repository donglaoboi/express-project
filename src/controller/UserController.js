const moment = require("moment");
const md5 = require("md5");
const { Op } = require("sequelize");

const ultiFuntion = require("../utils/Function");
const HTTP = require("../config/HttpRequest");

const User = require("../model/User");
const UserService = require("../service/UserService");
const BaseService = require("../service/BaseService");
const ErrorResponse = require("../helper/ErrorRespone");
const Response = require("../helper/Respone");
const Validate = require("../helper/Validate");

const CONFIG = require("../config/Config");

class UserController {
  async createUser(req, res, next) {
    const { username, password, email, age, phone, address } = req.body;
    if (!username || !password || !email || !phone || !address) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
    if (
      !Validate.valiDateMail(email) ||
      !Validate.valiDatePhone(phone) | Validate.validateNumber(age)
    ) {
      return next(
        new ErrorResponse(
          HTTP.STATUSCODE.BADREQUEST,
          HTTP.ERRORCODE.VALIDATEERROR
        )
      );
    }
    let data = {
      username,
      password,
      email,
      age,
      phone,
      address,
      createBy: username,
      updateBy: username,
    };
    data.password = md5(password);
    data.verifyCode = ultiFuntion.random();
    let timevalid = parseInt(process.env.TIMEVALID);
    data.verifyCodeValid = moment().local().add(timevalid, "m");
    try {
      const condition = {
        where: {
          [Op.or]: {
            username: username,
            email: email,
          },
        },
      };
      const u = await User.findOne(condition);
      if (u) {
        return next(
          new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message)
        );
      }
      let user = await UserService.createUser(data);
      let link = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verifyEmail/`;
      ultiFuntion.sendMail(user.dataValues, link);
      return new Response(
        HTTP.STATUSCODE.CREATESUCCESS,
        HTTP.MESSAGE.CREATESUCCESS,
        user
      ).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    }
  }

  async login(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
    try {
      let token = await BaseService.login(username, password);
      return res.status(HTTP.STATUSCODE.SUCCESS).json({
        isSuccess: true,
        message: HTTP.MESSAGE.SUCCESS,
        token: token,
      });
    } catch (error) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.UNAUTHORIZED, error.message)
      );
    }
  }

  async getList(req, res, next) {
    try {
      let offset,
        limit,
        list,
        sort = req.query.sort ? req.query.sort : "asc";
      if (sort !== "asc" && sort !== "desc") {
        sort = "asc";
      }
      const pageIndex = req.params.pageIndex;
      const pageSize = CONFIG.INDEX.PAGESIZE;
      if (!+pageIndex) {
        return next(
          new ErrorResponse(
            HTTP.STATUSCODE.BADREQUEST,
            HTTP.ERRORCODE.BADREQUEST
          )
        );
      }
      offset = (pageIndex - 1) * pageSize;
      limit = pageSize;
      list = await BaseService.getList(
        User,
        offset,
        limit,
        sort,
        pageIndex,
        pageSize
      );
      return new Response(
        HTTP.STATUSCODE.SUCCESS,
        HTTP.MESSAGE.SUCCESS,
        list
      ).jsonResponse(res);
    } catch (error) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
  }

  async getDetail(req, res, next) {
    if (!req.user.id) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
    let userId = req.user.id;
    try {
      let user = await UserService.getDetail(userId);
      return new Response(
        HTTP.STATUSCODE.SUCCESS,
        HTTP.MESSAGE.SUCCESS,
        user
      ).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    }
  }

  async update(req, res, next) {
    if (!req.user.id) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
    if (!req.body.age && req.body.age < 1) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
    let userId = req.user.id;
    const { email, age, phone, address } = req.body;
    let data = { email, age, phone, address };
    data.updateBy = req.user.username;
    try {
      await BaseService.update(User, userId, data);
      return new Response(
        HTTP.STATUSCODE.SUCCESS,
        HTTP.MESSAGE.UPDATESUCCESS,
        null
      ).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    }
  }

  async updatePassword(req, res, next) {
    if (!req.user.id) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
    let userId = req.user.id;
    let { password, Newpassword, Confimpassword } = req.body;
    try {
      if (!password || !Newpassword || !Confimpassword) {
        console.log("aaaaa");
        return next(
          new ErrorResponse(
            HTTP.STATUSCODE.BADREQUEST,
            HTTP.ERRORCODE.BADREQUEST
          )
        );
      }
      if (Newpassword !== Confimpassword) {
        return next(
          new ErrorResponse(
            HTTP.STATUSCODE.BADREQUEST,
            HTTP.ERRORCODE.VALIDATEERROR
          )
        );
      }
      password = md5(password);
      Newpassword = md5(Newpassword);
      if (req.user.password !== password) {
        return next(
          new ErrorResponse(
            HTTP.STATUSCODE.BADREQUEST,
            HTTP.ERRORCODE.INCORRECTPASSWORDS
          )
        );
      }
      const data = { password: Newpassword };
      await BaseService.update(User, userId, data);
      return new Response(
        HTTP.STATUSCODE.SUCCESS,
        HTTP.MESSAGE.UPDATESUCCESS,
        null
      ).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    }
  }

  async fillterUser(req, res, next) {
    try {
      let offset,
        limit,
        list,
        q = req.query.q ? req.query.q : null,
        sort = req.query.sort ? req.query.sort : "asc";
      if (sort !== "asc" && sort !== "desc") {
        sort = "asc";
      }
      const pageIndex = req.query.page
        ? req.query.page
        : CONFIG.INDEX.DEFAULT_PAGEINDEX;
      const pageSize = CONFIG.INDEX.PAGESIZE;
      if (!+pageIndex) {
        return next(
          new ErrorResponse(
            HTTP.STATUSCODE.BADREQUEST,
            HTTP.ERRORCODE.BADREQUEST
          )
        );
      }
      offset = (pageIndex - 1) * pageSize;
      limit = pageSize;
      list = await UserService.fillter(
        User,
        offset,
        limit,
        sort,
        pageIndex,
        pageSize,
        q
      );
      return new Response(
        HTTP.STATUSCODE.SUCCESS,
        HTTP.MESSAGE.SUCCESS,
        list
      ).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    }
  }

  async delete(req, res, next) {
    if (!req.user.id) {
      return next(
        new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST)
      );
    }
    const { userid } = req.body;
    const userId = userid;
    try {
      await BaseService.delete(User, userId, req.user.username);
      return new Response(
        HTTP.STATUSCODE.SUCCESS,
        HTTP.MESSAGE.DELETESUCCESS,
        null
      ).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    }
  }
}

module.exports = new UserController();
