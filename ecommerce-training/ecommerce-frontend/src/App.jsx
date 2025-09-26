import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Products</Link>
        <Link to="/auth">Login/Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
