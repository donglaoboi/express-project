const express = require('express');
const router = express.Router();

const orderController = require('../controller/OrderController');
const middleWare = require('../middleware/MiddleWare');
const CONFIG = require('../config/Config');
const URL = require('../middleware/URL');

router.get('/getList/:pageIndex', URL('/api/v1/orders/getList/:pageIndex'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.READ, CONFIG.PERMISSIONS.CREATE, CONFIG.PERMISSIONS.EDIT])
  , orderController.getList);
router.post('/create', URL('/api/v1/orders/create'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.CREATE])
  , orderController.create);
router.delete('/delete/:id', URL('/api/v1/orders/delete/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.DELETE, , CONFIG.PERMISSIONS.READ])
  , orderController.delete);
router.get('/search', middleWare.auth, URL('/api/v1/orders/search'), middleWare.hasRole([CONFIG.PERMISSIONS.READ])
  , orderController.fillterOrder);
router.get('/searchByUser', middleWare.auth, URL('/api/v1/orders/searchByUser'), middleWare.hasRole([CONFIG.PERMISSIONS.READ])
  , orderController.fillterOrderByUser);
router.get('/:id', URL('/api/v1/orders/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.READ])
  , orderController.getDetail);
router.patch('/updateConfirm/:id', URL('/api/v1/orders/updateConfirm/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.EDIT])
  , orderController.updateConfirm);
router.patch('/updateShipping/:id', URL('/api/v1/orders/updateShipping/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.EDIT])
  , orderController.updateShipping);
router.patch('/updateDelivered/:id', URL('/api/v1/orders/updateDelivered/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.EDIT])
  , orderController.updateDelivered);
router.patch('/cancel/:id', URL('/api/v1/orders/cancel/:id'), middleWare.auth, middleWare.hasRole([CONFIG.PERMISSIONS.EDIT])
  , orderController.cancel);

module.exports = router;
