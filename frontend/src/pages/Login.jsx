import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginApi } from "../api/authApi";
import { getErrorMessage } from "../api/axiosClient";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowNotice(false);

    // Free-tier backends can take 30-50s to wake up from sleep — let the
    // person know what's happening instead of it looking frozen/broken.
    const slowTimer = setTimeout(() => setSlowNotice(true), 5000);

    try {
      const { data } = await loginApi(form);
      setAuth(data);
      navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setSlowNotice(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl font-bold text-pine dark:text-paper">
          Welcome back
        </h1>
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
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-3 text-sm dark:border-paper/20"
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-ember">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-stamp bg-ember py-3 text-sm font-medium text-paper disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
        {slowNotice && (
          <p className="text-center text-xs text-pine/50 dark:text-paper/40">
            First request can be slow if the server was asleep — hang tight…
          </p>
        )}
        <p className="text-center text-sm text-pine/60 dark:text-paper/50">
          No account? <Link to="/register" className="text-ember">Register</Link>
        </p>
      </form>
    </div>
  );
}
