import api from './api'

/* ---------------- ORGANIZER ---------------- */

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

/* ---------------- PARTICIPANT ---------------- */

/**
 * POST /api/events/join
 * Body: { event_code }
 * Response: { event: {...}, message }
 */
export const joinEvent = async (eventCode) => {
  const response = await api.post('/api/events/join', {
    event_code: eventCode,
  })
  return response.data
}

/**
 * GET /api/events/my-events
 * Response: { events: [...] }  (only events the participant has joined)
 */
export const getMyEvents = async () => {
  const response = await api.get('/api/events/my-events')
  return response.data
}

/* Convenience default export (same shape as v1) */
export default {
  listEvents,
  getEvent,
  createEvent,
  deleteEvent,
  joinEvent,
  getMyEvents,
}
