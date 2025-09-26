import api from "./api";

export async function getCart() {
  const res = await api.get("/me/cart");
  return res.data;
}

export async function addToCart(productId, quantity = 1) {
  const res = await api.post("/me/cart", { productId, quantity });
  return res.data;
}

export async function removeFromCart(productId) {
  await api.delete(`/me/cart/${productId}`);
}

export async function checkout() {
  const res = await api.post("/me/checkout");
  return res.data;
}
