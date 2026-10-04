import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { getEvent } from '../services/eventService.js'
import analyticsService from '../services/analyticsService.js'
import StatCard from '../components/StatCard.jsx'
import InsightCard from '../components/InsightCard.jsx'
import Loader from '../components/Loader.jsx'
import ErrorBox from '../components/ErrorBox.jsx'

const DOMINANT_COLOR = {
  positive: 'text-green-600',
  neutral:  'text-yellow-600',
  negative: 'text-red-600',
}

const SENTIMENT_COLORS = {
  positive: '#10B981',  // emerald
  neutral:  '#F59E0B',  // amber
  negative: '#EF4444',  // red
}

function EventDetail() {
  const { id } = useParams()

  const [event, setEvent] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch both in parallel
      const [eventData, analyticsData] = await Promise.all([
        getEvent(id).catch(() => ({ event: null })),
        analyticsService.getEventAnalytics(id),
      ])
      setEvent(eventData?.event || null)
      setAnalytics(analyticsData)
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Could not load event analytics.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) return <Loader text="Loading event analytics…" />

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link to="/events" className="text-sm text-gray-500 hover:underline">
            ← Back to events
          </Link>
        </div>
        <ErrorBox message={error} onRetry={load} title="Could not load analytics" />
      </div>
    )
  }

  const totalFb = analytics?.total_feedback ?? 0
  const avgSat = analytics?.avg_satisfaction
  const breakdown = analytics?.sentiment_breakdown || {}

  // Convert sentiment_breakdown to Recharts data
  const pieData = ['positive', 'neutral', 'negative']
    .map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      value: Number(breakdown[key]) || 0,
      color: SENTIMENT_COLORS[key],
    }))
    .filter((d) => d.value > 0)

  // Dominant sentiment for a StatCard
  const dominant = pieData.length
    ? pieData.reduce((a, b) => (a.value > b.value ? a : b))
    : null

  // Normalize top_keywords: supports both ["delay","rude"] and [{word,count}]
  const keywords = (analytics?.top_keywords || []).map((k) =>
    typeof k === 'string' ? { word: k, count: null } : { word: k.word, count: k.count }
  )

  const insights = analytics?.insights || []

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/events" className="text-sm text-gray-500 hover:underline">
          ← Back to events
        </Link>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <h1 className="text-3xl font-bold text-primary">
            {event?.name || 'Event Analytics'}
          </h1>
          {event?.event_code && (
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
              {event.event_code}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-1">
          Feedback insights for this event.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Feedback"
          value={totalFb}
          icon="💬"
          color="text-primary"
        />
        <StatCard
          label="Avg Satisfaction"
          value={avgSat != null ? Number(avgSat).toFixed(2) : '—'}
          icon="⭐"
          subtext={avgSat != null ? 'Out of 9' : 'No satisfaction data yet'}
          color="text-yellow-600"
        />
        <StatCard
          label="Dominant Sentiment"
          value={dominant ? dominant.name : '—'}
          icon="🎯"
          subtext={dominant ? `${dominant.value} of ${totalFb} feedbacks` : 'Awaiting feedback'}
          color={dominant ? DOMINANT_COLOR[dominant.key] : 'text-gray-400'}
        />
      </div>

      {/* Charts + keywords row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sentiment distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sentiment Breakdown</h2>
          {pieData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No feedback yet. Sentiment chart appears once feedback is submitted.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top keywords */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Keywords</h2>
          {keywords.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Keywords will appear once feedback is analyzed.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {keywords.map((k, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                >
                  <span>{k.word}</span>
                  {k.count != null && (
                    <span className="text-xs opacity-60 font-mono">×{k.count}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
        {insights.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Insights will be generated once enough feedback is collected.
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <InsightCard
                key={i}
                title={ins.title}
                description={ins.description}
                severity={ins.severity}
              />
            ))}
          </div>
        )}
      </div>

      {/* Refresh */}
      <div className="text-center mt-6">
        <button
          onClick={load}
          className="text-sm text-primary hover:underline"
        >
          ↻ Refresh analytics
        </button>
      </div>
    </div>
  )
}

export default EventDetail
