const express= require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders');
const CheckAuth = require('../middleware/check-auth');

router.post('/', CheckAuth, OrdersController.order_create);

router.get('/', CheckAuth, OrdersController.orders_get_all);

router.get('/:orderID', CheckAuth ,OrdersController.orders_get_specific_order);
 
router.delete('/:orderID', CheckAuth, OrdersController.order_delete);

module.exports= router;