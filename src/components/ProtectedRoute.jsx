import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Where each role lands after login / when they hit a wrong-role page
export const HOME_FOR_ROLE = {
  organizer:   "/dashboard",
  participant: "/home",
  admin:       "/admin",
};

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1) Wait for the /api/auth/me round-trip on refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  // 2) Not logged in → /login (remember where they were going)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 3) Email not verified → /verify-email
  //    Admin is exempt (platform account is pre-seeded and verified).
  if (!user.verified && user.role !== "admin") {
    return <Navigate to="/verify-email" replace state={{ email: user.email }} />;
  }

  // 4) Role check — if allowedRoles is set, user.role must be in it
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = HOME_FOR_ROLE[user.role] || "/login";
    return <Navigate to={fallback} replace />;
  }

  // 5) All checks passed
  return children;
}

export default ProtectedRoute;
