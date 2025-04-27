import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("username", form.username);
      params.append("password", form.password);

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        setError(data.detail || "Credenciales incorrectas");
      }
    } catch {
      setError("Error al conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="px-2 max-w-xl mx-auto my-4" onSubmit={handleSubmit}>
      <div className="name">
        <label htmlFor="username">Usuario</label>
        <input
          required
          type="text"
          id="username"
          name="username"
          className="border block"
          placeholder="Tu usuario"
          value={form.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          required
          type="password"
          id="password"
          name="password"
          className="border block"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition"
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </div>
    </form>
  );
}
