import { useSearchParams, Link } from 'react-router-dom'
import Overview from './Overview.jsx'
import Organizations from './Organizations.jsx'
import Users from './Users.jsx'
import ModelTraining from './ModelTraining.jsx'
import Settings from './Settings.jsx'

const TABS = {
  overview:         { label: 'Overview',       icon: '📊', Component: Overview },
  organizations:    { label: 'Organizations',  icon: '🏢', Component: Organizations },
  users:            { label: 'Users',          icon: '👥', Component: Users },
  'model-training': { label: 'Model Training', icon: '🧠', Component: ModelTraining },
  settings:         { label: 'Settings',       icon: '⚙️', Component: Settings },
}

const DEFAULT_TAB = 'overview'

function AdminPanel() {
  const [params] = useSearchParams()
  const requested = params.get('tab') || DEFAULT_TAB
  const activeKey = TABS[requested] ? requested : DEFAULT_TAB
  const ActiveView = TABS[activeKey].Component

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">
          Platform administration and model training insights.
        </p>
      </div>

      {/* Mobile-only tab bar (sidebar is hidden below md) */}
      <div className="md:hidden bg-white rounded-lg shadow mb-4 overflow-x-auto">
        <div className="flex">
          {Object.entries(TABS).map(([key, t]) => (
            <Link
              key={key}
              to={`/admin?tab=${key}`}
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                activeKey === key
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Active view */}
      <ActiveView />
    </div>
  )
}

export default AdminPanel
