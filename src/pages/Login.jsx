import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HOME_FOR_ROLE } from "../components/ProtectedRoute.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Where to send the user after login:
  //   1) If ProtectedRoute redirected them, go back there
  //   2) Otherwise go to their role home
  const redirectAfterLogin = (user) => {
    const from = location.state?.from;
    if (from && from !== "/login") {
      navigate(from, { replace: true });
    } else {
      navigate(HOME_FOR_ROLE[user.role] || "/", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = await login({ email: email.trim(), password });

      // Backend may return user.verified = false with a token for
      // a "soft" login. Guard against that:
      if (user.verified === false) {
        navigate("/verify-email", { replace: true, state: { email: user.email } });
        return;
      }

      redirectAfterLogin(user);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";

      // Special case: unverified email → send them to verify
      if (/verify your email/i.test(msg)) {
        navigate("/verify-email", { replace: true, state: { email } });
        return;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="AI Event Feedback Analytics"
            className="w-20 h-20 object-contain mb-3"
          />
          <h1 className="text-2xl font-bold text-center text-primary">
            AI Event Feedback Analytics
          </h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          No account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
