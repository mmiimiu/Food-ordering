const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authRequired } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// ผู้ใช้ทั้งหมด
router.get('/users', authRequired, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', authRequired, isAdmin, adminController.deleteUser);

// ร้านทั้งหมด
router.get('/restaurants', authRequired, isAdmin, adminController.getAllRestaurants);
router.delete('/restaurants/:id', authRequired, isAdmin, adminController.deleteRestaurant);

// ออเดอร์ทั้งหมด
router.get('/orders', authRequired, isAdmin, adminController.getAllOrders);

// รายงานยอดขาย
router.get('/reports/sales', authRequired, isAdmin, adminController.getSalesReport);

module.exports = router;