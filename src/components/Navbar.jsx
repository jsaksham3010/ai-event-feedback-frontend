import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/dashboard" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="text-lg font-semibold text-gray-800">
          Event Feedback Analytics
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {user?.name || 'Guest'}
        </span>
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
