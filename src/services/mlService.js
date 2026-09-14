import api from './api'

/**
 * Predict Satisfaction Score for a participant.
 * @param {Object} participantData - 15 features
 * @returns {Promise<Object>} { predicted_satisfaction, model, target }
 */
export const predictSatisfaction = async (participantData) => {
  const response = await api.post('/api/predict/satisfaction', participantData)
  return response.data
}
