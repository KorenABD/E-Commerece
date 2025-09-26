import api from "./api";

export async function register(email, password, name) {
  const res = await api.post("/auth/register", { email, password, name });
  localStorage.setItem("token", res.data.token);
  return res.data.user;
}

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data.user;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
