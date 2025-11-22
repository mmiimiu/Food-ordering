const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const ordersController = require('../controllers/orders.controller');

router.post('/', authRequired, ordersController.createOrder);
POST /api/restaurant/1/orders

module.exports = router;