import api from "./api";

export async function getOrders() {
  const res = await api.get("/me/orders");
  return res.data;
}
