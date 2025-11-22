const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurants.controller');
const { authRequired } = require('../middleware/auth');

// ลูกค้า: ดูร้านทั้งหมด
router.get('/', restaurantController.getAllRestaurants);

// ลูกค้า: ดูเมนูของร้านนั้นๆ
router.get('/:restaurant_id/menus', restaurantController.getMenusByRestaurant);

// ร้านอาหาร: เพิ่มเมนู
router.post('/menus', authRequired, restaurantController.addMenu);

// ร้านอาหาร: แก้ไขเมนู
router.put('/menus/:id', authRequired, restaurantController.updateMenu);

// ร้านอาหาร: ลบเมนู
router.delete('/menus/:id', authRequired, restaurantController.deleteMenu);

// ร้านอาหาร: ดูออเดอร์ร้านตัวเอง
router.get('/orders/my', authRequired, restaurantController.getOrdersForRestaurant);

// ร้านอาหาร: อัปเดตสถานะคำสั่งซื้อ
router.put('/orders/:order_id/status', authRequired, restaurantController.updateOrderStatus);

module.exports = router;