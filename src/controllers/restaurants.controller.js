const pool = require('../config/db');

// GET ร้านทั้งหมด (ลูกค้าใช้เลือก)
exports.getAllRestaurants = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM restaurants");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};

// GET เมนูทั้งหมดของร้านตาม restaurant_id
exports.getMenusByRestaurant = async (req, res) => {
  const { restaurant_id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM menus WHERE restaurant_id = ?",
      [restaurant_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};

// ร้านเพิ่มเมนูอาหาร
exports.addMenu = async (req, res) => {
  const restaurant_id = req.user.id; // เจ้าของร้าน
  const { name, price } = req.body;

  try {
    await pool.query(
      `INSERT INTO menus (restaurant_id, name, price) VALUES (?, ?, ?)`,
      [restaurant_id, name, price]
    );
    res.status(201).json({ message: "เพิ่มเมนูสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};

// ร้านแก้ไขเมนู
exports.updateMenu = async (req, res) => {
  const { id } = req.params;   // menu_id
  const { name, price, is_available } = req.body;

  try {
    await pool.query(
      `UPDATE menus SET name=?, price=?, is_available=? WHERE id=?`,
      [name, price, is_available, id]
    );
    res.json({ message: "อัปเดตเมนูสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

// ร้านลบเมนู
exports.deleteMenu = async (req, res) => {
  const { id } = req.params; // menu_id

  try {
    await pool.query(`DELETE FROM menus WHERE id = ?`, [id]);
    res.json({ message: "ลบเมนูสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

// ดูคำสั่งซื้อทั้งหมดของร้าน
exports.getOrdersForRestaurant = async (req, res) => {
  const restaurant_id = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM orders WHERE restaurant_id = ? ORDER BY created_at DESC`,
      [restaurant_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

// ร้านอัปเดตสถานะเตรียมอาหาร
exports.updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body; // preparing / delivering / completed

  try {
    await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, order_id]
    );
    res.json({ message: "อัปเดตสถานะคำสั่งซื้อสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};