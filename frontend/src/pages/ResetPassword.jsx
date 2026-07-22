import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../api/authApi";
import { getErrorMessage } from "../api/axiosClient";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi(token, password);
      toast.success("Password reset! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Reset link may have expired"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl font-bold text-pine dark:text-paper">
          Set a new password
        </h1>
        <input
          required
          type="password"
          placeholder="New password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-3 text-sm dark:border-paper/20"
        />
        <input
          required
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-stamp border border-pine/20 bg-transparent p-3 text-sm dark:border-paper/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-stamp bg-ember py-3 text-sm font-medium text-paper disabled:opacity-50"
        >
          {loading ? "Saving…" : "Reset password"}
        </button>
        <p className="text-center text-sm text-pine/60 dark:text-paper/50">
          <Link to="/login" className="text-ember">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
