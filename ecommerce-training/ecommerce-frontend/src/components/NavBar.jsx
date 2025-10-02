import { getCurrentUser, logout } from "../services/auth";
import { Link } from "react-router-dom";

export default function Navbar() {
  const user = getCurrentUser();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Products</Link>
        <Link to="/cart" className="hover:underline">Cart</Link>
        <Link to="/orders" className="hover:underline">Orders</Link>
        {user?.role === "ADMIN" && (
          <Link to="/admin" className="hover:underline">Admin</Link>
        )}
      </div>

      <div>
        {user ? (
          <span className="ml-4">
            Logged in as <strong>{user.name}</strong> ({user.role})
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="ml-2 bg-red-500 px-2 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </span>
        ) : (
          <Link to="/auth" className="hover:underline">Login/Register</Link>
        )}
      </div>
    </nav>
  );
}
