import api from './api'

/**
 * Analytics HTTP wrappers.
 * Endpoint prefix: "/api/analytics/*"
 *
 * Response shape for getEventAnalytics:
 * {
 *   total_feedback: number,
 *   sentiment_breakdown: { positive: n, negative: n, neutral: n },
 *   avg_satisfaction: number,
 *   top_keywords: [{ word, count } | string, ...],
 *   insights: [{ title, description, severity }, ...]
 * }
 *
 * Where `severity` is one of: "low" | "medium" | "high" | "info"
 */

const analyticsService = {
  /**
   * GET /api/analytics/event/:id
   * Organizer-only. Guarded by ProtectedRoute on the page side.
   */
  getEventAnalytics: async (eventId) => {
    const { data } = await api.get(`/api/analytics/event/${eventId}`)
    return data
  },
}

export default analyticsService
