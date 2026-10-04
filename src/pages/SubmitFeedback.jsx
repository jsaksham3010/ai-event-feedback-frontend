import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getEvent } from '../services/eventService.js'
import feedbackService from '../services/feedbackService.js'

const SENTIMENT_STYLES = {
  positive: { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-500'  },
  negative: { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-500'    },
  neutral:  { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-500' },
}

function SubmitFeedback() {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [eventLoading, setEventLoading] = useState(true)
  const [eventError, setEventError] = useState('')

  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState(null)

  // Load event details on mount
  useEffect(() => {
    let cancelled = false
    async function load() {
      setEventLoading(true)
      setEventError('')
      try {
        const data = await getEvent(eventId)
        if (!cancelled) setEvent(data.event)
      } catch (err) {
        if (!cancelled) {
          setEventError(
            err?.response?.data?.error ||
            err?.message ||
            'Could not load event details.'
          )
        }
      } finally {
        if (!cancelled) setEventLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [eventId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setResult(null)

    if (!text.trim()) {
      setSubmitError('Please write something before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const data = await feedbackService.create({
        event_id: eventId,
        text: text.trim(),
      })
      setResult(data)
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not submit feedback. Please try again.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNew = () => {
    setText('')
    setResult(null)
    setSubmitError('')
  }

  /* ---------- Event loading state ---------- */
  if (eventLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm mt-3">Loading event…</p>
        </div>
      </div>
    )
  }

  if (eventError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-semibold mb-1">Could not load event</p>
          <p className="text-sm">{eventError}</p>
          <Link to="/home" className="inline-block mt-3 text-primary underline text-sm">
            ← Back to my events
          </Link>
        </div>
      </div>
    )
  }

  const colors = result ? (SENTIMENT_STYLES[result.sentiment] || SENTIMENT_STYLES.neutral) : null
  const confidencePct = result?.confidence != null ? (result.confidence * 100).toFixed(1) : null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/home" className="text-sm text-gray-500 hover:underline">
          ← Back to my events
        </Link>
        <h1 className="text-3xl font-bold text-primary mt-2">Submit Feedback</h1>
        {event?.name && (
          <p className="text-gray-600 mt-1">
            For event: <span className="font-medium">{event.name}</span>
          </p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Share your honest experience. Your feedback helps organizers improve.
        </p>
      </div>

      {/* Result card (replaces form on success) */}
      {result && colors && (
        <div className={`${colors.bg} ${colors.border} border p-6 rounded-lg mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Thank you! ✅</h2>
            <span className={`${colors.badge} text-white px-4 py-1 rounded-full text-xs font-semibold uppercase`}>
              {result.sentiment || 'analyzed'}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            {result.cleaned_text && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Analyzed text</p>
                <p className={`${colors.text} bg-white/60 p-3 rounded-lg`}>
                  {result.cleaned_text}
                </p>
              </div>
            )}

            {confidencePct && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Confidence</p>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold">{confidencePct}%</span>
                  <div className="flex-1 bg-white/60 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${colors.badge} h-full transition-all`}
                      style={{ width: `${confidencePct}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Model score — not a calibrated probability.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleNew}
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Submit another
            </button>
            <button
              onClick={() => navigate('/my-feedback')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
            >
              View my feedback
            </button>
          </div>
        </div>
      )}

      {/* Form (hidden after success) */}
      {!result && (
        <div className="bg-white p-6 rounded-lg shadow">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Feedback
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What went well? What could be improved?"
                rows={6}
                maxLength={1000}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
                disabled={submitting}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {text.length} / 1000
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Analyzing…' : 'Submit Feedback'}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Feedback is analyzed by an NLP model and stored securely.
          </p>
        </div>
      )}
    </div>
  )
}

export default SubmitFeedback
