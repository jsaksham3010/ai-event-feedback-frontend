import { useEffect, useState } from 'react'
import Loader from '../../components/Loader.jsx'
import ErrorBox from '../../components/ErrorBox.jsx'
import adminService from '../../services/adminService.js'

function fmtDate(iso) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch { return iso }
}

const getCreated = (o) => o.created_at || o.createdAt

function Organizations() {
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMock, setIsMock] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminService.getOrganizations()
      setOrgs(data.organizations || [])
      setIsMock(Boolean(data.isMock))
    } catch (err) {
      const status = err?.response?.status
      setError(
        status === 403 ? 'Admin access required.'
        : status === 401 ? 'Session expired. Please log in again.'
        : err?.response?.data?.error || err?.message || 'Could not load organizations.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <Loader text="Loading organizations…" />
  if (error) return <ErrorBox message={error} onRetry={load} title="Could not load organizations" />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Organizations</h2>
          <p className="text-gray-500 text-sm mt-1">
            All organizations registered on the platform.
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
            <code className="bg-yellow-100 px-1 rounded">GET /api/admin/organizations</code>{' '}
            isn&apos;t live yet. The list will populate automatically once it exists.
          </p>
        </div>
      )}

      {orgs.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-5xl mb-4">🏢</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No organizations to show
          </h3>
          <p className="text-gray-500 text-sm">
            {isMock
              ? 'Waiting for the backend endpoint.'
              : 'No organizations have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Owner</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                  <th className="text-right px-4 py-3 font-medium">Members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orgs.map((o) => (
                  <tr key={o._id || o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {o.name || o.organization_name || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {o.owner_email || o.owner?.email || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {fmtDate(getCreated(o))}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {o.member_count ?? o.user_count ?? '—'}
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

export default Organizations
