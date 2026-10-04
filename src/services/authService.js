import api from "./api";

/**
 * Auth HTTP wrappers.
 * NOTE: These are STATELESS — they call the API and return data.
 * State changes (setting token/user) live in AuthContext.
 *
 * Endpoint prefix: "/api/auth/*"  (matches existing services convention)
 */

const authService = {
  /**
   * POST /api/auth/signup
   * Body: { email, password, name, role, organization_name? }
   * role: "organizer" | "participant"
   * Response: { message, user: {..., verified: false}, otp_debug? }
   *
   * NOTE: does NOT log the user in. They must verify email first.
   */
  signup: async ({ email, password, name, role, organization_name }) => {
    const body = { email, password, name, role };
    if (role === "organizer" && organization_name) {
      body.organization_name = organization_name;
    }
    const { data } = await api.post("/api/auth/signup", body);
    return data;
  },

  /**
   * POST /api/auth/verify-email
   * Body: { email, otp }
   * Response: { token, user: {..., verified: true} }
   */
  verifyEmail: async ({ email, otp }) => {
    const { data } = await api.post("/api/auth/verify-email", { email, otp });
    return data;
  },

  /**
   * POST /api/auth/login
   * Body: { email, password }
   * Response: { token, user }
   * Errors: { error: "Please verify your email first" }
   */
  login: async ({ email, password }) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    return data;
  },

  /**
   * GET /api/auth/me
   * Headers: Authorization: Bearer <token>  (added by api.js interceptor)
   * Response: { user }
   */
  getMe: async () => {
    const { data } = await api.get("/api/auth/me");
    return data;
  },
};

export default authService;
