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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {user ? `${user.name}'s Orders` : "My Orders"}
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">
                Order #{order.id}
              </h2>
              <p className="text-gray-600">Status: {order.status}</p>
              <p className="text-gray-600">Total: ${Number(order.total).toFixed(2)}</p>
              <p className="text-gray-500 text-sm">
                Date: {new Date(order.createdAt).toLocaleString()}
              </p>

              <ul className="mt-4 space-y-2">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>${Number(item.unitPrice).toFixed(2)}</span>
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
