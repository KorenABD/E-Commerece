import { useEffect, useState } from "react";
import { getOrders } from "../services/orders";
import { getCurrentUser } from "../services/auth";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    getOrders()
      .then(data => setOrders(data))
      .catch(() => alert("Login required to view orders"));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{user ? `${user.name}'s Orders` : "My Orders"}</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
              <h2>Order #{order.id}</h2>
              <p>User: {user?.name}</p> {/* 🟢 show logged in user */}
              <p>Status: {order.status}</p>
              <p>Total: ${Number(order.total).toFixed(2)}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.product.name} — {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
