import api from './api'

export const listEvents = async (organizationId) => {
  const response = await api.get('/api/events', {
    params: { organization_id: organizationId },
  })
  return response.data
}

export const getEvent = async (eventId) => {
  const response = await api.get(`/api/events/${eventId}`)
  return response.data
}

export const createEvent = async (eventData) => {
  const response = await api.post('/api/events', eventData)
  return response.data
}

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/api/events/${eventId}`)
  return response.data
}
