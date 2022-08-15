const express = require('express');
const router = express.Router();
const multer = require('../utils/Multer');

const productController = require('../controller/ProductController');
const middleWare = require('../middleware/MiddleWare');
const CONFIG = require('../config/Config');
const URL = require('../middleware/URL');

router.get('/getList/:pageIndex', URL('/api/v1/products/getList/:pageIndex'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.READ])
  , productController.getList);
router.post('/create', URL('/api/v1/products/create'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.CREATE])
  , multer.array('images', 12), productController.create);
router.patch('/update/:id', URL('/api/v1/products/getList/update/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.EDIT])
  , multer.array('images', 12), productController.update);
router.delete('/delete/:id', URL('/api/v1/products/delete/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.DELETE])
  , productController.delete);
router.delete('/deleteMany', URL('/api/v1/products/deleteMany'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.DELETE])
  , productController.deleteMany);
router.get('/search', middleWare.auth, URL('/api/v1/products/search'), middleWare.hasRole([CONFIG.PERMISSIONS.READ])
  , productController.fillterProduct);
router.get('/:id', URL('/api/v1/products/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.READ])
  , productController.getDetail);

module.exports = router;