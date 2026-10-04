import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "organizer",
    organization_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };
      if (form.role === "organizer") {
        payload.organization_name = form.organization_name.trim();
      }

      const data = await signup(payload);

      // Redirect to verify-email, carrying the email + otp_debug (demo)
      navigate("/verify-email", {
        replace: true,
        state: {
          email: payload.email,
          otp_debug: data?.otp_debug || null,
          signup_message: data?.message || "Account created. Check your email for the OTP.",
        },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again.";
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
            Create Account
          </h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            Start analyzing your events
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
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
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">I am a…</label>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              <option value="organizer">Event Organizer</option>
              <option value="participant">Participant</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {form.role === "organizer"
                ? "Create events and see analytics."
                : "Join events with a code and submit feedback."}
            </p>
          </div>

          {form.role === "organizer" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={form.organization_name}
                onChange={(e) => update("organization_name", e.target.value)}
                placeholder="e.g., City Sports Club"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
