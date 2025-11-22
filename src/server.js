import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import Database from "better-sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("food.db");

// ---- init tables (run once) ----
db.exec(`
CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY,
  name TEXT,
  open_time TEXT,  -- "10:00"
  close_time TEXT, -- "20:00"
  cutoff_min INTEGER DEFAULT 5
);

CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY,
  restaurant_id INTEGER,
  name TEXT,
  ingredients TEXT,
  price INTEGER,
  image TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  restaurant_id INTEGER,
  total_price INTEGER,
  order_status TEXT DEFAULT 'NEW',
  payment_status TEXT DEFAULT 'PENDING',
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER,
  menu_id INTEGER,
  qty INTEGER
);
`);

// seed ร้านเดียวถ้ายังไม่มี
const r = db.prepare("SELECT * FROM restaurants WHERE id=1").get();
if (!r) {
  db.prepare(`
    INSERT INTO restaurants (id,name,open_time,close_time,cutoff_min)
    VALUES (1,'My Restaurant','10:00','20:00',5)
  `).run();
}

// helper: คำนวณ last order time
function calcLastOrder(open_time, close_time, cutoff_min) {
  const today = dayjs().format("YYYY-MM-DD");
  const closeDT = dayjs(`${today} ${close_time}`);
  return closeDT.subtract(cutoff_min, "minute");
}

function isOrderAllowed(restaurant) {
  const today = dayjs().format("YYYY-MM-DD");
  const now = dayjs();
  const openDT = dayjs(`${today} ${restaurant.open_time}`);
  const closeDT = dayjs(`${today} ${restaurant.close_time}`);
  const lastOrderDT = calcLastOrder(
    restaurant.open_time,
    restaurant.close_time,
    restaurant.cutoff_min
  );
  return now.isAfter(openDT) && now.isBefore(lastOrderDT);
}

// ---- API: ร้านเดียว status ----
app.get("/restaurants/1/status", (req, res) => {
  const restaurant = db.prepare("SELECT * FROM restaurants WHERE id=1").get();
  const lastOrderDT = calcLastOrder(
    restaurant.open_time,
    restaurant.close_time,
    restaurant.cutoff_min
  );

  res.json({
    restaurant_id: 1,
    open_time: restaurant.open_time,
    close_time: restaurant.close_time,
    cutoff_min: restaurant.cutoff_min,
    last_order_time: lastOrderDT.format("HH:mm"),
    is_open_for_order: isOrderAllowed(restaurant),
    now: dayjs().format("HH:mm"),
  });
});

// ---- API: create order (กันสั่งหลัง cutoff) ----
app.post("/restaurants/1/orders", (req, res) => {
  const restaurant = db.prepare("SELECT * FROM restaurants WHERE id=1").get();
  if (!isOrderAllowed(restaurant)) {
    return res.status(400).json({ message: "ร้านปิดรับออเดอร์แล้ว" });
  }

  const { items, total_price } = req.body;
  if (!items?.length) {
    return res.status(400).json({ message: "ไม่มีรายการอาหาร" });
  }

  const info = db.prepare(`
    INSERT INTO orders (restaurant_id,total_price,created_at)
    VALUES (1,?,?)
  `).run(total_price, dayjs().toISOString());

  const orderId = info.lastInsertRowid;
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id,menu_id,qty)
    VALUES (?,?,?)
  `);

  const trx = db.transaction((items) => {
    for (const it of items) insertItem.run(orderId, it.menu_id, it.qty);
  });
  trx(items);

  res.json({ order_id: orderId, payment_status: "PENDING" });
});

// ---- API: mock payment ----
app.post("/orders/:id/pay", (req, res) => {
  const orderId = req.params.id;
  const order = db.prepare("SELECT * FROM orders WHERE id=?").get(orderId);
  if (!order) return res.status(404).json({ message: "ไม่พบออเดอร์" });

  db.prepare(`
    UPDATE orders SET payment_status='PAID'
    WHERE id=?
  `).run(orderId);

  res.json({ message: "ชำระเงินสำเร็จ (จำลอง)" });
});

// ---- API: list orders (customer/rider/admin ใช้ร่วม) ----
app.get("/orders", (req, res) => {
  const orders = db.prepare(`
    SELECT * FROM orders ORDER BY id DESC
  `).all();
  res.json(orders);
});

// ---- API: update order status (ร้านหรือไรเดอร์) ----
app.patch("/orders/:id/status", (req, res) => {
  const { order_status } = req.body;
  db.prepare(`UPDATE orders SET order_status=? WHERE id=?`)
    .run(order_status, req.params.id);
  res.json({ ok: true });
});

app.listen(3001, () => console.log("API running :3001"));
