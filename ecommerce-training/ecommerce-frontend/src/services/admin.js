import api from "./api";

export async function createProduct(data) {
  const res = await api.post("/admin/products", data);
  return res.data;
}

export async function updateProduct(id, data) {
  const res = await api.put(`/admin/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
}

export async function getAllOrders() {
  const res = await api.get("/admin/orders");
  return res.data;
}

export async function updateOrderStatus(id, status) {
  const res = await api.put(`/admin/orders/${id}`, { status });
  return res.data;
}
