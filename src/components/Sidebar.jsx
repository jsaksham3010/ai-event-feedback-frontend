import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/events',    label: 'Events',    icon: '📅' },
  { to: '/predict',   label: 'Predict',   icon: '🎯' },
  { to: '/sentiment', label: 'Sentiment', icon: '💬' },
]

function Sidebar() {
  return (
    <aside className="w-60 bg-white min-h-screen shadow-sm border-r border-gray-100 hidden md:block">
      <div className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span className="text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
