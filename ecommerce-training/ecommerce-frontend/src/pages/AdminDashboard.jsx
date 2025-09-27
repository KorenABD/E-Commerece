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

//   async function handleDeleteProduct(id) {
//     await deleteProduct(id);
//     loadProducts();
//   }

  async function handleUpdateOrder(id, status) {
    await updateOrderStatus(id, status);
    loadOrders();
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>

      {/* Product Management */}
      <h2>Products</h2>
      <form onSubmit={handleAddProduct}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Category ID" type="number" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required />
        <input placeholder="In Stock" type="number" value={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.value })} required />
        <button type="submit">Add Product</button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} — ${Number(p.price).toFixed(2)} ({p.inStock} in stock)
            {/* <button onClick={() => handleDeleteProduct(p.id)}>Delete</button> */}
          </li>
        ))}
      </ul>

      {/* Order Management */}
      <h2>Orders</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "1rem" }}>
          <h3>Order #{order.id} — {order.status}</h3>
          <p>User: {order.user.email}</p>
          <p>Total: ${Number(order.total).toFixed(2)}</p>
          <ul>
            {order.items.map(item => (
              <li key={item.id}>{item.product.name} × {item.quantity}</li>
            ))}
          </ul>
          <select value={order.status} onChange={e => handleUpdateOrder(order.id, e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
