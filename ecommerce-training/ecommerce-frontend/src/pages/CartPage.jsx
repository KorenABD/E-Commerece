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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No items in your cart.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <ul className="divide-y divide-gray-200">
            {items.map(it => (
              <li key={it.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="font-medium">{it.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {it.quantity} × ${Number(it.product.price).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(it.productId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
