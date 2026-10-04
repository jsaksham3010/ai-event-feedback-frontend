import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

// Matches the key used by services/api.js interceptor
const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  /* Persist / clear token — interceptor reads from localStorage */
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  /* Re-hydrate user on mount */
  useEffect(() => {
    let cancelled = false;
    async function loadMe() {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get("/api/auth/me");
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) { setToken(null); setUser(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMe();
    return () => { cancelled = true; };
  }, [token]);

  /* ---------------- actions ---------------- */

  const signup = useCallback(
    async ({ email, password, name, role, organization_name }) => {
      setError(null);
      const body = { email, password, name, role };
      if (role === "organizer" && organization_name) {
        body.organization_name = organization_name;
      }
      const { data } = await api.post("/api/auth/signup", body);
      return data; // { message, user, otp_debug? } — NOT logged in yet
    },
    []
  );

  const verifyEmail = useCallback(async ({ email, otp }) => {
    setError(null);
    const { data } = await api.post("/api/auth/verify-email", { email, otp });
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Login failed";
      setError(msg);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    const { data } = await api.get("/api/auth/me");
    setUser(data.user);
    return data.user;
  }, [token]);

  /* ---------------- derived ---------------- */
  const isAuthenticated = Boolean(user && token);
  const isOrganizer     = user?.role === "organizer";
  const isParticipant   = user?.role === "participant";
  const isAdmin         = user?.role === "admin";
  const isVerified      = user?.verified === true;

  const value = {
    user, token, loading, error,
    signup, verifyEmail, login, logout, refreshUser,
    isAuthenticated, isOrganizer, isParticipant, isAdmin, isVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
