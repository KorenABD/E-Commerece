import { useEffect, useState } from "react";
import { getCart, removeFromCart, checkout } from "../services/cart";

export default function CartPage() {
  const [items, setItems] = useState([]);

  async function loadCart() {
    try {
      const data = await getCart();
      setItems(data);
    } catch (e) {
      alert("Login required!");
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleRemove(productId) {
    await removeFromCart(productId);
    loadCart();
  }

  async function handleCheckout() {
    const order = await checkout();
    alert(`Order placed! Order ID: ${order.id}, Total: $${order.total}`);
    loadCart();
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Cart</h1>
      {items.length === 0 ? <p>No items yet.</p> : (
        <ul>
          {items.map(it => (
            <li key={it.id}>
              {it.product.name} (x{it.quantity}) - ${Number(it.product.price) * it.quantity}
              <button onClick={() => handleRemove(it.productId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <button onClick={handleCheckout}>Checkout</button>
      )}
    </div>
  );
}
