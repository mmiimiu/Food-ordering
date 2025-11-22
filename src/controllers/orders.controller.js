const pool = require('../config/db');

exports.createOrder = async (req, res) => {
  const { restaurant_id, items } = req.body; 
  // items = [{menu_id, quantity, price}, ...]

  const customer_id = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) เช็คเวลาทำการร้าน
    const now = new Date();
    const weekday = now.getDay(); // 0-6

    const [hours] = await conn.query(
      `SELECT * FROM operating_hours 
       WHERE restaurant_id = ? AND weekday = ?`,
      [restaurant_id, weekday]
    );

    if (hours.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'ร้านไม่ได้ตั้งเวลาทำการในวันนี้' });
    }

    const { open_time, close_time } = hours[0];

    // แปลงเวลา
    const currentTimeStr = now.toTimeString().substring(0, 8); // HH:MM:SS
    if (!(currentTimeStr >= open_time && currentTimeStr <= close_time)) {
      await conn.rollback();
      return res.status(400).json({ message: 'ขณะนี้ร้านปิดทำการ ไม่สามารถสั่งซื้อได้' });
    }

    // 2) คำนวณราคาทั้งหมด
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });

    // 3) สร้าง order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (customer_id, restaurant_id, status, total_price)
       VALUES (?, ?, 'pending', ?)`,
      [customer_id, restaurant_id, total]
    );

    const orderId = orderResult.insertId;

    // 4) insert order_items
    const values = items.map((i) => [orderId, i.menu_id, i.quantity, i.price]);
    await conn.query(
      `INSERT INTO order_items (order_id, menu_id, quantity, price)
       VALUES ?`,
      [values]
    );

    await conn.commit();

    res.status(201).json({
      message: 'สร้างคำสั่งซื้อสำเร็จ',
      order_id: orderId
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  } finally {
    conn.release();
  }
};