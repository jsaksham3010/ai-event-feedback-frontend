import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { joinEvent } from '../services/eventService.js'

function JoinEvent() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [joinedEvent, setJoinedEvent] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setJoinedEvent(null)

    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      setError('Please enter an event code.')
      return
    }

    setLoading(true)
    try {
      const data = await joinEvent(cleanCode)
      setJoinedEvent(data.event)

      setTimeout(() => {
        navigate('/home', {
          replace: true,
          state: { flash: `Joined "${data.event?.name || 'event'}" successfully.` },
        })
      }, 1200)
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not join event. Check the code and try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setCode(v.slice(0, 12))
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Join an Event</h1>
        <p className="text-gray-500 text-sm mt-1">
          Enter the code shared by the event organizer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {joinedEvent && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg mb-4">
            <p className="font-semibold mb-1">✅ Joined successfully!</p>
            <p>{joinedEvent.name}</p>
            <p className="text-xs mt-1 opacity-75">Redirecting…</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="e.g., MARATHON26"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={12}
              className="w-full px-3 py-3 border rounded-lg text-center text-xl tracking-widest font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading || !!joinedEvent}
            />
            <p className="text-xs text-gray-500 mt-2">
              Codes are usually 6–10 characters, letters and numbers only.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !!joinedEvent || !code}
            className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Joining…' : joinedEvent ? 'Joined' : 'Join Event'}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <Link to="/home" className="text-primary hover:underline">
          ← Back to my events
        </Link>
      </div>
    </div>
  )
}

export default JoinEvent
