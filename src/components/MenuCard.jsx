// src/component/MenuCard.jsx
export default function MenuCard({ menu, onAdd }) {
  return (
    <div className="menu-card">
      <img className="menu-img" src={menu.image} alt={menu.name} />
      <h4>{menu.name}</h4>
      <div className="ingredients">
        <b>วัตถุดิบ:</b> {menu.ingredients}
      </div>
      <div className="price">ราคา: {menu.price} บาท</div>

      <button onClick={onAdd}>เพิ่มลงตะกร้า</button>
    </div>
  );
}
