import { useEffect, useState } from "react";
import api from "../services/api";
import { addToCart } from "../services/cart";
import Hero from "../components/Hero";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

 async function handleAdd(productId) {
  try {
    await addToCart(productId);
    alert("Added to cart!");
  } catch (e) {
    if (e.response?.data?.error) {
      // 🟢 Show backend error message (like "Only 2 left in stock")
      alert(e.response.data.error);
    } else {
      alert("You need to login first!");
    }
  }
}

  return (
    <div className="p-8">
      <Hero /> {/* 🟢 New Hero at top */}

      <h1 id="products" className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white shadow rounded-lg p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
            <p className="text-gray-600 flex-1">{p.description}</p>
            <p className="mt-2 text-lg font-bold">${Number(p.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Stock: {p.inStock}</p>
            {p.inStock > 0 ? (
              <button
                onClick={() => handleAdd(p.id)}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            ) : (
              <span className="mt-2 text-red-500 font-semibold">Out of stock</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
