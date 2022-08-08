const jwt = require('jsonwebtoken');

const User = require('../model/User');
const UserRole = require('../model/UserRole');
const Role = require('../model/Role');
const RoleModule = require('../model/RoleModule');
const ErrorResponse = require('../helper/ErrorRespone');
const HTTP = require('../config/HttpRequest');

class Middleware {

  async auth(req, res, next) {
    if (!req.headers['authorization']) {
      return next(new ErrorResponse(HTTP.STATUSCODE.UNAUTHORIZED, HTTP.MESSAGE.USERDONTLOGIN));
    }
    try {
      const authorizationheader = req.headers['authorization'];
      let token, data, checkToken, user;
      token = authorizationheader.split(' ')[1];
      checkToken = jwt.verify(token, process.env.PRIVATEKEY);
      data = checkToken;
      const condition = {
        where: { id: data.id }
      };
      user = await User.findOne(condition);
      if (user) {
        req.user = user;
        next();
      }
      else {
        return next(new ErrorResponse(HTTP.STATUSCODE.UNAUTHORIZED, HTTP.MESSAGE.UNAUTHORIZED));
      }
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.UNAUTHORIZED, HTTP.MESSAGE.UNAUTHORIZED));
    }
  }

  hasRole(permission) {
    return async function (req, res, next) {
      let data = {};
      let userid = req.user.id;
      data.api = req.api;
      permission.forEach((i) => {
        let role = i;
        data[role] = 1;
      });
      try {
        // //admin
        const condition1 = {
          include: [{
            model: UserRole,
            where: { userid: userid },
          }],
          where: { name: 'admin' }
        }
        let role = await Role.findAll(condition1);
        if (role.length != 0) { return next(); }

        //not admin
        const condition = {
          include: [{
            model: Role,
            include: [{
              model: UserRole,
              right: true,
              where: { userid: userid }
            }],
            right: true,
          }],
          where: data
        };
        let rolemodules = await RoleModule.findAll(condition);
        if (rolemodules.length > 0) return next();
        else {
          return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.MESSAGE.USERDONTPERMISION));

        }
      } catch (error) {

        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.MESSAGE.USERDONTPERMISION));
      }
    }
  }

}

module.exports = new Middleware();