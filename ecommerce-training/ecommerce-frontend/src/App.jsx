import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";




function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Products</Link>
        <Link to="/auth" style={{ marginRight: "1rem" }}>Login/Register</Link>
        <Link to="/cart" style={{ marginRight: "1rem" }}> Cart</Link>
        <Link to="/orders" style={{ marginRight: "1rem" }}>Orders</Link>
        <Link to="/admin" style={{ marginRight: "1rem" }}>Admin</Link>

      </nav>

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
