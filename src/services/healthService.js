import api from './api'

export const checkHealth = async () => {
  const response = await api.get('/api/health')
  return response.data
}
