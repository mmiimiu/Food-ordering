const pool = require('../config/db');

// GET ผู้ใช้ทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, full_name, email, role FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};

// ลบผู้ใช้
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.query(
        "DELETE FROM users WHERE id = ?",
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ใช้" });
      }
  
      res.json({ message: "ลบผู้ใช้สำเร็จ" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
  };
  
// ร้านอาหารทั้งหมด
exports.getAllRestaurants = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM restaurants");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

// ลบร้านอาหาร
exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.query(
        "DELETE FROM restaurants WHERE id = ?",
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "ไม่พบร้านอาหาร" });
      }
  
      res.json({ message: "ลบร้านอาหารสำเร็จ" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
  };
  
// ดูคำสั่งซื้อทั้งหมด
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

// ดูยอดขายรวมของแต่ละร้าน
exports.getSalesReport = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.restaurant_name,
             SUM(o.total_price) as total_sales,
             COUNT(o.id) as total_orders
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.status = 'completed'
      GROUP BY r.id
      ORDER BY total_sales DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};