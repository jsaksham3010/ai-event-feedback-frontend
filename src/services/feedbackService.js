import api from './api'

/**
 * Feedback HTTP wrappers.
 * Endpoints use the "/api/feedback/*" prefix.
 */

const feedbackService = {
  /**
   * POST /api/feedback
   * Body: { event_id, text }
   * Response: { message, sentiment, confidence, feedback_id }
   */
  create: async ({ event_id, text }) => {
    const { data } = await api.post('/api/feedback', { event_id, text })
    return data
  },

  /**
   * GET /api/feedback/my-feedback
   * Response: { feedbacks: [...] }
   * Each feedback likely includes: { _id, event_id, event_name, text,
   *   sentiment, confidence, created_at }
   */
  getMyFeedback: async () => {
    const { data } = await api.get('/api/feedback/my-feedback')
    return data
  },
}

export default feedbackService
