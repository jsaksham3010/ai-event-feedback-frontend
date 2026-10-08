import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../context/AuthContext.jsx'
import { checkHealth } from '../services/healthService.js'

// ---- Demo data (later replaced with real backend analytics) ----
const sentimentData = [
  { name: 'Positive', value: 120, color: '#10B981' },
  { name: 'Neutral',  value: 45,  color: '#F59E0B' },
  { name: 'Negative', value: 85,  color: '#EF4444' },
]

const satisfactionTrend = [
  { month: 'Jan', score: 5.2 },
  { month: 'Feb', score: 5.8 },
  { month: 'Mar', score: 6.1 },
  { month: 'Apr', score: 5.9 },
  { month: 'May', score: 6.4 },
  { month: 'Jun', score: 6.8 },
]

const engagementDist = [
  { level: 'Highly Engaged',    count: 403 },
  { level: 'Moderately Engaged', count: 294 },
  { level: 'Disengaged',         count: 303 },
]

function MetricCard({ label, value, subtext, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color || 'text-gray-800'}`}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const [backendStatus, setBackendStatus] = useState('checking')
  const [dbStatus, setDbStatus] = useState('checking')

  useEffect(() => {
    const check = async () => {
      try {
        const data = await checkHealth()
        setBackendStatus('online')
        setDbStatus(data.database === 'connected' ? 'connected' : 'error')
      } catch {
        setBackendStatus('offline')
        setDbStatus('unknown')
      }
    }
    check()
  }, [])

  const statusBadge = (status) => {
    const map = {
      online:       'bg-green-100 text-green-700',
      connected:    'bg-green-100 text-green-700',
      offline:      'bg-red-100 text-red-700',
      error:        'bg-red-100 text-red-700',
      checking:     'bg-gray-100 text-gray-600',
      unknown:      'bg-yellow-100 text-yellow-700',
    }
    return map[status] || map.checking
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ---- Header ---- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Welcome back, {user?.name || 'User'} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of your event feedback analytics
        </p>
      </div>

      {/* ---- Status Bar ---- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Backend:</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${statusBadge(backendStatus)}`}>
            {backendStatus}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Database:</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${statusBadge(dbStatus)}`}>
            {dbStatus}
          </span>
        </div>
      </div>

      {/* ---- Metric Cards ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Events"
          value="0"
          subtext="Create your first event"
          icon="📅"
        />
        <MetricCard
          label="Predictions Made"
          value="0"
          subtext="ML satisfaction predictions"
          icon="🎯"
          color="text-primary"
        />
        <MetricCard
          label="Feedback Analyzed"
          value="0"
          subtext="Sentiment analysis runs"
          icon="💬"
          color="text-secondary"
        />
        <MetricCard
          label="Avg Satisfaction"
          value="—"
          subtext="Out of 9 (need data)"
          icon="⭐"
          color="text-yellow-600"
        />
      </div>

      {/* ---- Quick Actions ---- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/events"
          className="bg-primary text-white p-5 rounded-lg shadow hover:opacity-90 transition-opacity"
        >
          <p className="text-2xl mb-2">📅</p>
          <p className="font-semibold">Manage Events</p>
          <p className="text-xs opacity-80 mt-1">Create and view events</p>
        </Link>
        <Link
          to="/predict"
          className="bg-secondary text-white p-5 rounded-lg shadow hover:opacity-90 transition-opacity"
        >
          <p className="text-2xl mb-2">🎯</p>
          <p className="font-semibold">Predict Satisfaction</p>
          <p className="text-xs opacity-80 mt-1">Run ML prediction</p>
        </Link>
        <Link
          to="/sentiment"
          className="bg-gray-800 text-white p-5 rounded-lg shadow hover:opacity-90 transition-opacity"
        >
          <p className="text-2xl mb-2">💬</p>
          <p className="font-semibold">Analyze Sentiment</p>
          <p className="text-xs opacity-80 mt-1">Check feedback sentiment</p>
        </Link>
      </div>

      {/* ---- Charts Row 1 ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Sentiment Distribution
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {sentimentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 text-center mt-2">
            Demo data — real data will come from feedback collection
          </p>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Participant Engagement
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={engagementDist}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 text-center mt-2">
            Demo data — from structured dataset
          </p>
        </div>
      </div>

      {/* ---- Charts Row 2 ---- */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Satisfaction Trend (Last 6 Months)
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={satisfactionTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 9]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 text-center mt-2">
          Demo data — trend will populate as events are analyzed
        </p>
      </div>

      {/* ---- Info Box ---- */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
        <p className="font-semibold mb-1">💡 About this dashboard</p>
        <p>
          Charts currently show <strong>demo data</strong>. Once you start
          creating events and analyzing feedback, real data will replace
          these placeholders. Dashboard pulls from your MongoDB via the
          Flask backend.
        </p>
      </div>
    </div>
  )
}

export default Dashboard
