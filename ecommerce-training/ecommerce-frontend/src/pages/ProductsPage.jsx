import { useEffect, useState } from "react";
import api from "../services/api";
import { addToCart } from "../services/cart";

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
    alert("✅ Added to cart!");
  } catch (e) {
    // Handle backend error
    if (e.response && e.response.data && e.response.data.error) {
      alert("❌ Unable to add to cart: " + e.response.data.error);
    } else {
      alert("❌ Unable to add to cart (login required or server error)");
    }
    console.error(e);
  }
}


  return (
    <div style={{ padding: "2rem" }}>
      <h1>Products</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {products.map(p => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <strong>${Number(p.price).toFixed(2)}</strong>
            <p><em>{p.category?.name}</em></p>
            <p>Stock: {p.inStock}</p>
            {p.inStock > 0 ? (
              <button onClick={() => handleAdd(p.id)}>Add to Cart</button>
            ) : (
              <span style={{ color: "red", fontWeight: "bold" }}>Out of stock</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}