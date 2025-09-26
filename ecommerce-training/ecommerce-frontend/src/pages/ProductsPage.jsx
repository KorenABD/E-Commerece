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
      alert("Added to cart!");
    } catch (e) {
      alert("You need to login first!");
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
            <button onClick={() => handleAdd(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
