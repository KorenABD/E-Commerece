import { useState } from "react";
import { register, login } from "../services/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [user, setUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isLogin) {
        const u = await login(form.email, form.password);
        setUser(u);
      } else {
        const u = await register(form.email, form.password, form.name);
        setUser(u);
      }
    } catch (err) {
      alert("Auth failed");
      console.error(err);
    }
  }

  if (user) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Welcome, {user.name}!</h1>
        <p>You are logged in as {user.email}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <br />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <br />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <p>
        {isLogin ? "No account?" : "Already have one?"}{" "}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}
