import { useState, useEffect } from "react";
import { createProduct, deleteProduct, getAllOrders, updateOrderStatus } from "../services/admin";
import api from "../services/api";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", categoryId: "", inStock: "" });

  async function loadProducts() {
    const res = await api.get("/products");
    setProducts(res.data);
  }

  async function loadOrders() {
    const res = await getAllOrders();
    setOrders(res);
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  async function handleAddProduct(e) {
    e.preventDefault();
    await createProduct({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      categoryId: parseInt(form.categoryId),
      inStock: parseInt(form.inStock),
    });
    setForm({ name: "", description: "", price: "", categoryId: "", inStock: "" });
    loadProducts();
  }

  async function handleDeleteProduct(id) {
    await deleteProduct(id);
    loadProducts();
  }

  async function handleUpdateOrder(id, status) {
    await updateOrderStatus(id, status);
    loadOrders();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Product Management */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className="border rounded px-3 py-2" type="number" step="0.01" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          <input className="border rounded px-3 py-2" type="number" placeholder="Category ID" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required />
          <input className="border rounded px-3 py-2" type="number" placeholder="In Stock" value={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.value })} required />
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 col-span-full sm:col-span-2 md:col-span-1">
            Add Product
          </button>
        </form>

        <ul className="divide-y divide-gray-200">
          {products.map(p => (
            <li key={p.id} className="flex justify-between items-center py-3">
              <span>{p.name} — ${Number(p.price).toFixed(2)} ({p.inStock} in stock)</span>
              <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Management */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
        {orders.map(order => (
          <div key={order.id} className="border rounded p-4 mb-4">
            <h3 className="font-semibold">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">User: {order.user.email}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${Number(order.total).toFixed(2)}</p>
            <ul className="list-disc pl-6 mb-2">
              {order.items.map(item => (
                <li key={item.id}>
                  {item.product.name} × {item.quantity}
                </li>
              ))}
            </ul>
            <select
              value={order.status}
              onChange={e => handleUpdateOrder(order.id, e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="SHIPPED">Shipped</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
