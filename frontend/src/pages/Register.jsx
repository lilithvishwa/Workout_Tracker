import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerApi(form);
      setAuth(data);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl font-bold text-pine dark:text-paper">
          Start your streak
        </h1>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-3 text-sm dark:border-paper/20"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-3 text-sm dark:border-paper/20"
        />
        <input
          required
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-3 text-sm dark:border-paper/20"
        />
        <button type="submit" className="w-full rounded-stamp bg-ember py-3 text-sm font-medium text-paper">
          Create account
        </button>
        <p className="text-center text-sm text-pine/60 dark:text-paper/50">
          Already have an account? <Link to="/login" className="text-ember">Log in</Link>
        </p>
      </form>
    </div>
  );
}
