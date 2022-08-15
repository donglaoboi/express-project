const generator = require('generate-password');

const Order = require('../model/Order');
const BaseService = require('../_service/BaseService');
const OrderService = require('../_service/OrderService');
const ErrorResponse = require('../helper/ErrorRespone');
const Response = require('../helper/Respone');

const HTTP = require('../config/HttpRequest');
const CONFIG = require('../config/Config');

class OrderController {

  async getList(req, res, next) {
    try {
      let offset, limit, list, sort = req.query.sort ? req.query.sort : 'asc';
      if (sort !== 'asc' && sort !== 'desc') {
        sort = 'asc';
      };
      const pageIndex = req.params.pageIndex;
      const pageSize = CONFIG.INDEX.PAGESIZE;
      if (!+pageIndex) {
        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
      };
      offset = (pageIndex - 1) * pageSize;
      limit = pageSize;
      list = await BaseService.getList(Order, offset, limit, sort, pageIndex, pageSize);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.SUCCESS, list)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async create(req, res, next) {
    const { listProduct, voucherid, tax } = req.body;
    const userid = req.user.id;
    if (!listProduct || !tax) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    let orderCode = generator.generate({
      length: 5,
      numbers: true
    });
    const data = {
      listProduct,
      voucherid,
      orderCode,
      tax,
      userid,
      createBy: req.user.username,
      updateBy: req.user.username,
    };
    try {
      let order = await OrderService.createOrder(data);
      return new Response(HTTP.STATUSCODE.CREATESUCCESS, HTTP.MESSAGE.CREATESUCCESS, order)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async updateConfirm(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    let id = req.params.id;
    let username = req.user.username;
    try {
      await OrderService.updateConfirm(id, username);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.UPDATESUCCESS, null)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async updateShipping(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    let id = req.params.id;
    try {
      const condition = {
        where: {
          id: id,
          orderStatus: CONFIG.STATUSODER.CONFIRMED
        }
      };
      let order = await Order.findOne(condition);
      if (!order) {
        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.ORDERISNOTCONFIRMED));
      }
      else {
        order.orderStatus = CONFIG.STATUSODER.SHIPPING;
        order.updateBy = req.user.username;
        await order.save();
      };
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.UPDATESUCCESS, null)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async updateDelivered(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    let id = req.params.id;
    try {
      const condition = {
        where: {
          id: id,
          orderStatus: CONFIG.STATUSODER.SHIPPING
        }
      };
      let order = await Order.findOne(condition);
      if (!order) {
        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.MESSAGE.ORDERISNOTSHIPPING));
      }
      else {
        order.orderStatus = CONFIG.STATUSODER.DELIVERED;
        order.updateBy = req.user.username;
        await order.save();
      };
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.UPDATESUCCESS, null)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async delete(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    let id = req.params.id;
    let username = req.user.username;
    try {
      await OrderService.deleteOrder(id, username);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.DELETESUCCESS, null)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async cancel(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    let id = req.params.id;
    let username = req.user.username;
    try {
      await OrderService.cancelOrder(id, username);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.CANCELORDERSUCCESS, null)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async getDetail(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    try {
      let id = req.params.id;
      let order = await OrderService.getDetail(id);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.SUCCESS, order)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async fillterOrder(req, res, next) {
    try {
      let offset, limit, list, userid = req.query.userid ? req.query.userid : null, sort = req.query.sort ? req.query.sort : 'asc';
      if (sort !== 'asc' && sort !== 'desc') {
        sort = 'asc';
      };
      const pageIndex = req.query.page ? req.query.page : CONFIG.INDEX.DEFAULT_PAGEINDEX;
      const pageSize = CONFIG.INDEX.PAGESIZE;
      if (!+pageIndex) {
        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
      };
      offset = (pageIndex - 1) * pageSize;
      limit = pageSize;
      list = await OrderService.fillterOrder(offset, limit, sort, pageIndex, pageSize, userid);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.SUCCESS, list).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  }

  async fillterOrderByUser(req, res, next) {
    try {
      let offset, limit, list, userid = req.user.id, sort = req.query.sort ? req.query.sort : 'asc';
      if (sort !== 'asc' && sort !== 'desc') {
        sort = 'asc';
      };
      const pageIndex = req.query.page ? req.query.page : CONFIG.INDEX.DEFAULT_PAGEINDEX;
      const pageSize = CONFIG.INDEX.PAGESIZE;
      if (!+pageIndex) {
        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
      };
      offset = (pageIndex - 1) * pageSize;
      limit = pageSize;
      list = await OrderService.fillterOrder(offset, limit, sort, pageIndex, pageSize, userid);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.SUCCESS, list).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  }

}

module.exports = new OrderController();