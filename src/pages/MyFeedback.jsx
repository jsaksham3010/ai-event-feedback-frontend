import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import feedbackService from '../services/feedbackService.js'

const SENTIMENT_BADGES = {
  positive: 'bg-green-500',
  negative: 'bg-red-500',
  neutral:  'bg-yellow-500',
}

function fmtDate(iso) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

/* Backend might return created_at OR createdAt OR submitted_at */
const getDate = (fb) => fb.created_at || fb.createdAt || fb.submitted_at

function MyFeedback() {
  const location = useLocation()
  const flash = location.state?.flash || ''

  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFeedbacks = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await feedbackService.getMyFeedback()
      setFeedbacks(data.feedbacks || [])
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load your feedback. Backend must be running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Feedback</h1>
          <p className="text-gray-500 text-sm mt-1">
            Feedback you've submitted, analyzed by our NLP model.
          </p>
        </div>
        <Link
          to="/home"
          className="text-sm text-primary hover:underline"
        >
          ← Back to my events
        </Link>
      </div>

      {/* Flash message (from JoinEvent redirect) */}
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
            onClick={fetchFeedbacks}
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
          <p className="text-gray-500 text-sm mt-3">Loading your feedback…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && feedbacks.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-5xl mb-4">📝</p>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            No feedback yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Once you submit feedback for an event, it appears here.
          </p>
          <Link
            to="/home"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            Go to My Events
          </Link>
        </div>
      )}

      {/* Feedback list */}
      {!loading && feedbacks.length > 0 && (
        <div className="space-y-3">
          {feedbacks.map((fb) => {
            const badge = SENTIMENT_BADGES[fb.sentiment] || SENTIMENT_BADGES.neutral
            return (
              <div
                key={fb._id || fb.feedback_id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {fb.event_name && (
                      <span className="font-semibold text-gray-800 text-sm">
                        {fb.event_name}
                      </span>
                    )}
                    {fb.event_code && (
                      <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {fb.event_code}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {fmtDate(getDate(fb))}
                    </span>
                    <span className={`${badge} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
                      {fb.sentiment || 'unknown'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                  {fb.text || fb.original_text || '(no text)'}
                </p>

                {fb.confidence != null && (
                  <p className="text-xs text-gray-400 mt-2">
                    Model score: {(fb.confidence * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Refresh */}
      {!loading && feedbacks.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={fetchFeedbacks}
            className="text-sm text-primary hover:underline"
          >
            ↻ Refresh
          </button>
        </div>
      )}
    </div>
  )
}

export default MyFeedback
