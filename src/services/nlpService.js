import api from './api'

/**
 * Analyze sentiment of a text feedback.
 * @param {string} text - Feedback text
 * @returns {Promise<Object>} { sentiment, confidence, cleaned_text }
 */
export const analyzeSentiment = async (text) => {
  const response = await api.post('/api/sentiment', { text })
  return response.data
}
