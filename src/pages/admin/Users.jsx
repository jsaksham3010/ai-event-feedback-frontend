import { useEffect, useState } from 'react'
import Loader from '../../components/Loader.jsx'
import ErrorBox from '../../components/ErrorBox.jsx'
import RoleBadge from '../../components/RoleBadge.jsx'
import adminService from '../../services/adminService.js'

function fmtDate(iso) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch { return iso }
}

const getCreated = (u) => u.created_at || u.createdAt

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMock, setIsMock] = useState(false)
  const [filter, setFilter] = useState('all')  // 'all' | 'organizer' | 'participant' | 'admin'

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminService.getUsers()
      setUsers(data.users || [])
      setIsMock(Boolean(data.isMock))
    } catch (err) {
      const status = err?.response?.status
      setError(
        status === 403 ? 'Admin access required.'
        : status === 401 ? 'Session expired. Please log in again.'
        : err?.response?.data?.error || err?.message || 'Could not load users.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <Loader text="Loading users…" />
  if (error) return <ErrorBox message={error} onRetry={load} title="Could not load users" />

  const filtered = filter === 'all'
    ? users
    : users.filter((u) => u.role === filter)

  const counts = {
    all:         users.length,
    organizer:   users.filter((u) => u.role === 'organizer').length,
    participant: users.filter((u) => u.role === 'participant').length,
    admin:       users.filter((u) => u.role === 'admin').length,
  }

  const FILTERS = [
    { key: 'all',         label: 'All' },
    { key: 'organizer',   label: 'Organizers' },
    { key: 'participant', label: 'Participants' },
    { key: 'admin',       label: 'Admins' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Users</h2>
          <p className="text-gray-500 text-sm mt-1">
            All users registered on the platform.
          </p>
        </div>
        <button onClick={load} className="text-sm text-primary hover:underline">
          ↻ Refresh
        </button>
      </div>

      {isMock && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-lg mb-4">
          <p className="font-semibold mb-1">Endpoint pending</p>
          <p className="text-xs">
            <code className="bg-yellow-100 px-1 rounded">GET /api/admin/users</code>{' '}
            isn&apos;t live yet. The list will populate automatically once it exists.
          </p>
        </div>
      )}

      {/* Filter pills */}
      {users.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === f.key
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? 'opacity-80' : 'text-gray-400'}`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-5xl mb-4">👥</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {users.length === 0 ? 'No users to show' : 'No users match this filter'}
          </h3>
          <p className="text-gray-500 text-sm">
            {isMock
              ? 'Waiting for the backend endpoint.'
              : users.length === 0
                ? 'No users have registered yet.'
                : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Verified</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {u.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {u.email || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      {u.verified ? (
                        <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {fmtDate(getCreated(u))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
