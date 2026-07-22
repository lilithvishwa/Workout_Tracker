import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../api/authApi";
import { getErrorMessage } from "../api/axiosClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl font-bold text-pine dark:text-paper">
          Reset your password
        </h1>

        {sent ? (
          <p className="text-sm text-pine/70 dark:text-paper/60">
            If an account exists for <strong>{email}</strong>, a reset link is on its way.
            Check your inbox (and spam folder).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              type="email"
              placeholder="Your account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-stamp border border-pine/20 bg-transparent p-3 text-sm dark:border-paper/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-stamp bg-ember py-3 text-sm font-medium text-paper disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-pine/60 dark:text-paper/50">
          <Link to="/login" className="text-ember">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
