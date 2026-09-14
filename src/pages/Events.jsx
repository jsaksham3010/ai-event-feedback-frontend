import { useState, useEffect } from 'react'
import {
  listEvents,
  createEvent,
  deleteEvent,
} from '../services/eventService.js'

// Temporary: hardcoded org id (will come from auth later)
const TEST_ORG_ID = '6aa80955fd3ef325c414cadc'

const initialForm = {
  name: '',
  type: 'marathon',
  participant_count: 0,
}

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  // ---- Fetch events on mount ----
  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listEvents(TEST_ORG_ID)
      setEvents(data.events || [])
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to load events. Backend must be running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // ---- Create handler ----
  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = {
        organization_id: TEST_ORG_ID,
        name: form.name,
        type: form.type,
        participant_count: Number(form.participant_count),
      }
      await createEvent(payload)
      setForm(initialForm)
      setShowForm(false)
      await fetchEvents()
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to create event.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Delete handler ----
  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) return

    try {
      await deleteEvent(eventId)
      setEvents((prev) => prev.filter((e) => e._id !== eventId))
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to delete event.'
      )
    }
  }

  // ---- Format date ----
  const fmtDate = (iso) => {
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Events</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your organization's events
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {/* ---- Error ---- */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* ---- Create Form ---- */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Event</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="e.g., Annual Marathon 2026"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="marathon">Marathon</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Participant Count
                </label>
                <input
                  type="number"
                  value={form.participant_count}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      participant_count: e.target.value,
                    })
                  }
                  min={0}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm)
                  setShowForm(false)
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---- Loading ---- */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Loading events...</p>
        </div>
      )}

      {/* ---- Empty State ---- */}
      {!loading && events.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-gray-600 mb-2">No events yet</p>
          <p className="text-gray-400 text-sm">
            Click "+ New Event" to create your first event
          </p>
        </div>
      )}

      {/* ---- Events List ---- */}
      {!loading && events.length > 0 && (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {event.name}
                </h3>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">
                    {event.type}
                  </span>
                  <span>📅 {fmtDate(event.created_at)}</span>
                  <span>👥 {event.participant_count || 0} participants</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(event._id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg"
                title="Delete event"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---- Refresh Button ---- */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchEvents}
          className="text-sm text-primary hover:underline"
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  )
}

export default Events
