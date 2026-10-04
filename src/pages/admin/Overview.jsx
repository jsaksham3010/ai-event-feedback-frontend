import { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard.jsx'
import Loader from '../../components/Loader.jsx'
import ErrorBox from '../../components/ErrorBox.jsx'
import adminService from '../../services/adminService.js'

function Overview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminService.getPlatformStats()
      setStats(data)
    } catch (err) {
      const status = err?.response?.status
      const msg =
        status === 403 ? 'Admin access required.'
        : status === 401 ? 'Your session has expired. Please log in again.'
        : err?.response?.data?.error || err?.message || 'Could not load platform stats.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <Loader text="Loading platform stats…" />

  if (error) {
    return <ErrorBox message={error} onRetry={load} title="Could not load stats" />
  }

  const s = stats || {}

  return (
    <div>
      {s.isMock && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-lg mb-4">
          <p className="font-semibold mb-1">Demo data</p>
          <p className="text-xs">
            The admin platform-stats endpoint isn&apos;t live yet. Values below
            will populate automatically once Saksham ships it.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          label="Organizations"
          value={s.total_orgs ?? 0}
          icon="🏢"
          color="text-primary"
        />
        <StatCard
          label="Users"
          value={s.total_users ?? 0}
          icon="👥"
          color="text-primary"
        />
        <StatCard
          label="Events"
          value={s.total_events ?? 0}
          icon="📅"
          color="text-primary"
        />
        <StatCard
          label="Feedback Received"
          value={s.total_feedback ?? 0}
          icon="💬"
          color="text-secondary"
        />
        <StatCard
          label="Predictions Made"
          value={s.total_predictions ?? 0}
          icon="🎯"
          color="text-secondary"
        />
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={load}
          className="text-sm text-primary hover:underline"
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  )
}

export default Overview
