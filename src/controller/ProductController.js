const Product = require('../model/Product');
const BaseService = require('../_service/BaseService');
const ProductService = require('../_service/ProductService');
const ErrorResponse = require('../helper/ErrorRespone');
const Response = require('../helper/Respone');
const Validate = require('../helper/Validate');

const HTTP = require('../config/HttpRequest');
const CONFIG = require('../config/Config');

class ProductController {

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
      list = await BaseService.getList(Product, offset, limit, sort, pageIndex, pageSize);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.SUCCESS, list)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async create(req, res, next) {
    try {
      if (!req.files) {
        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
      };
      const images = req.files;
      const { categoryid, name, barcode, priceImport, priceSelling, weight, quantity, description } = req.body;
      if (!categoryid || !name || !barcode || !priceImport || !priceSelling
        || !weight || !quantity || !description || images.length === 0
        || +priceImport <= 0 || (+priceSelling) <= 0 || +weight <= 0 || +quantity <= 0) {
        return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
      };
      const data = {
        categoryid,
        name,
        barcode,
        priceImport,
        priceSelling,
        weight,
        quantityActual: quantity,
        quantityDisplay: quantity,
        description,
        createBy: req.user.username,
        updateBy: req.user.username,
      };
      let product = await ProductService.createProduct(images, data);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.CREATESUCCESS, product)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async update(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    const { categoryid, name, barcode, priceImport, priceSelling, weight, quantity, description } = req.body;
    let data, id;
    data = { categoryid, name, barcode, priceImport, priceSelling, weight, quantity, description };
    data.files = req.files;
    data.updateBy = req.user.username;
    id = req.params.id;
    if (Validate.validateNumber(data.quantity)) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.QUANTITYNOTVALID));
    };
    if (Validate.validateNumber(data.priceImport) || Validate.validateNumber(data.priceSelling) ||
      Validate.validateNumber(data.weight)) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.VALIDATEERROR));
    };
    try {
      await ProductService.updateProduct(id, data);
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
    let updateBy = req.user.username;
    try {
      await ProductService.deleteProduct(id, updateBy);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.DELETESUCCESS, null)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async deleteMany(req, res, next) {
    let { listProduct } = req.body;
    let updateBy = req.user.username;
    if (!listProduct) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, HTTP.ERRORCODE.BADREQUEST));
    };
    try {
      await ProductService.deleteMany(listProduct, updateBy);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.DELETESUCCESS, null)
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
      let product = await ProductService.getProduct(id);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.SUCCESS, product)
        .jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

  async fillterProduct(req, res, next) {
    try {
      let offset, limit, list, q = req.query.q ? req.query.q : null, sort = req.query.sort ? req.query.sort : 'asc';
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
      list = await BaseService.fillter(Product, offset, limit, sort, pageIndex, pageSize, q);
      return new Response(HTTP.STATUSCODE.SUCCESS, HTTP.MESSAGE.SUCCESS, list).jsonResponse(res);
    } catch (error) {
      return next(new ErrorResponse(HTTP.STATUSCODE.BADREQUEST, error.message));
    };
  };

}

module.exports = new ProductController();