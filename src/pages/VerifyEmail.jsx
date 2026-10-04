import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HOME_FOR_ROLE } from "../components/ProtectedRoute.jsx";

const OTP_LENGTH = 6;

function VerifyEmail() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email          = location.state?.email;
  const otpDebug       = location.state?.otp_debug;
  const signupMessage  = location.state?.signup_message;

  const [otp, setOtp]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [resentMsg, setResentMsg] = useState("");

  const inputRef = useRef(null);

  // If someone hits /verify-email directly (no email in state), bounce them
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  // Autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResentMsg("");

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    setLoading(true);
    try {
      const { user } = await verifyEmail({ email, otp: cleanOtp });
      // Redirect by role
      navigate(HOME_FOR_ROLE[user.role] || "/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Verification failed. Please check the code and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDebugOtp = () => {
    if (otpDebug) {
      setOtp(String(otpDebug));
      inputRef.current?.focus();
    }
  };

  // Don't render the form until we know there's an email
  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="AI Event Feedback Analytics"
            className="w-16 h-16 object-contain mb-3"
          />
          <h1 className="text-2xl font-bold text-center text-primary">
            Verify Your Email
          </h1>
          <p className="text-center text-gray-500 text-sm mt-2">
            We sent a {OTP_LENGTH}-digit code to{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        {signupMessage && !error && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs p-3 rounded-lg mb-4">
            {signupMessage}
          </div>
        )}

        {otpDebug && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 rounded-lg mb-4">
            <p className="font-semibold mb-1">Demo mode</p>
            <p>
              OTP: <span className="font-mono font-bold">{otpDebug}</span>{" "}
              <button
                type="button"
                onClick={fillDebugOtp}
                className="underline hover:no-underline"
              >
                (auto-fill)
              </button>
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {resentMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg mb-4">
            {resentMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Verification Code
            </label>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder={"0".repeat(OTP_LENGTH)}
              className="w-full px-3 py-3 border rounded-lg text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== OTP_LENGTH}
            className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          <p>
            Wrong email?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Start over
            </Link>
          </p>
          <p>
            Already verified?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
