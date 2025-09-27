import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import { getCurrentUser, logout } from "./services/auth";

function Navbar() {
  const user = getCurrentUser();
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <a href="/">Products</a> | 
      <a href="/cart">Cart</a> | 
      <a href="/orders">Orders</a> | 
      <a href="/auth">Login/Register</a>
      {/* ✅ Show Admin only if user is ADMIN */}
      {user?.role === "ADMIN" && (
        <> | <a href="/admin">Admin</a></>
      )}
      {user && (
        <span style={{ marginLeft: "1rem" }}>
          Logged in as <strong>{user.name}</strong> ({user.role})
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Logout
          </button>
        </span>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;