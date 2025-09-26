import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

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
          </div>
        ))}
      </div>
    </div>
  );
}
