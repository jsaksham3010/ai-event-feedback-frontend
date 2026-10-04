import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyEvents } from '../services/eventService.js'

function fmtDate(iso) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

/* Read both "createdAt" and "created_at" to tolerate either backend convention */
const getCreated = (event) => event.created_at || event.createdAt

function ParticipantHome() {
  const { user } = useAuth()
  const location = useLocation()
  const flash = location.state?.flash || ''
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMyEvents()
      setEvents(data.events || [])
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load your events. Backend must be running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Welcome, {user?.name || 'Participant'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Events you've joined. Share your feedback to help organizers improve.
          </p>
        </div>
        <Link
          to="/join"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 font-medium"
        >
          + Join Event
        </Link>
      </div>

      {flash && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-3 rounded-lg mb-6">
          {flash}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button
            onClick={fetchEvents}
            className="text-primary underline text-xs mt-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm mt-3">Loading your events…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && events.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-5xl mb-4">🎟️</p>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            No events yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Join an event using the code shared by the organizer.
          </p>
          <Link
            to="/join"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            Join Your First Event
          </Link>
        </div>
      )}

      {/* Events list */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {event.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                  {event.type && (
                    <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">
                      {event.type}
                    </span>
                  )}
                  <span>📅 {fmtDate(getCreated(event))}</span>
                  {event.event_code && (
                    <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {event.event_code}
                    </span>
                  )}
                </div>
              </div>

              <Link
                to={`/feedback/${event._id}`}
                className="w-full text-center bg-primary text-white py-2 rounded-lg hover:opacity-90 text-sm font-medium"
              >
                Submit Feedback
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Refresh */}
      {!loading && events.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={fetchEvents}
            className="text-sm text-primary hover:underline"
          >
            ↻ Refresh
          </button>
        </div>
      )}
    </div>
  )
}

export default ParticipantHome
