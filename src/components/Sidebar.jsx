import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/* ---------- Link maps per role ---------- */

const ORGANIZER_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/events',    label: 'Events',    icon: '📅' },
  { to: '/predict',   label: 'Predict',   icon: '🎯' },
  { to: '/sentiment', label: 'Sentiment', icon: '💬' },
]

const PARTICIPANT_LINKS = [
  { to: '/home',        label: 'My Events',   icon: '🏠' },
  { to: '/join',        label: 'Join Event',  icon: '🔗' },
  { to: '/my-feedback', label: 'My Feedback', icon: '📝' },
]

/* Admin uses query-param tabs — see AdminPanel.jsx */
const ADMIN_LINKS = [
  { to: '/admin?tab=overview',       tab: 'overview',       label: 'Overview',       icon: '📊' },
  { to: '/admin?tab=organizations',  tab: 'organizations',  label: 'Organizations',  icon: '🏢' },
  { to: '/admin?tab=users',          tab: 'users',          label: 'Users',          icon: '👥' },
  { to: '/admin?tab=model-training', tab: 'model-training', label: 'Model Training', icon: '🧠' },
  { to: '/admin?tab=settings',       tab: 'settings',       label: 'Settings',       icon: '⚙️' },
]

const LINKS_BY_ROLE = {
  organizer:   ORGANIZER_LINKS,
  participant: PARTICIPANT_LINKS,
  admin:       ADMIN_LINKS,
}

function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const links = LINKS_BY_ROLE[user.role] || []

  /* Active state detection.
   * - Admin links: match pathname === "/admin" AND tab query param.
   * - Events link: also active on /events/:id (detail page).
   * - Everything else: exact pathname match.
   */
  const isActive = (link) => {
    const path = location.pathname
    const params = new URLSearchParams(location.search)

    if (link.tab) {
      return path === '/admin' && params.get('tab') === link.tab
    }
    if (path === link.to) return true
    if (link.to === '/events' && path.startsWith('/events/')) return true
    return false
  }

  return (
    <aside className="w-60 bg-white min-h-screen shadow-sm border-r border-gray-100 hidden md:block">
      <div className="p-4 space-y-1">
        {links.map((link) => {
          const active = isActive(link)
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
