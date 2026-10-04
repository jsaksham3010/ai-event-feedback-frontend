import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { HOME_FOR_ROLE } from './ProtectedRoute.jsx'
import RoleBadge from './RoleBadge.jsx'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const homeLink = user ? (HOME_FOR_ROLE[user.role] || '/') : '/login'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to={homeLink} className="flex items-center space-x-3">
        <img
          src="/logo.png"
          alt="AI Event Feedback Analytics"
          className="w-10 h-10 object-contain"
        />
        <span className="text-lg font-semibold text-gray-800 hidden sm:inline">
          AI Event Feedback Analytics
        </span>
      </Link>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {user?.name || 'Guest'}
          </span>
          {user?.role && <RoleBadge role={user.role} />}
        </div>

        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
