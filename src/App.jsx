import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute, { HOME_FOR_ROLE } from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'

/* ---------- Public pages ---------- */
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'

/* ---------- Organizer pages ---------- */
import Dashboard from './pages/Dashboard.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Predict from './pages/Predict.jsx'
import Sentiment from './pages/Sentiment.jsx'

/* ---------- Participant pages ---------- */
import ParticipantHome from './pages/ParticipantHome.jsx'
import JoinEvent from './pages/JoinEvent.jsx'
import SubmitFeedback from './pages/SubmitFeedback.jsx'
import MyFeedback from './pages/MyFeedback.jsx'

/* ---------- Admin panel ---------- */
import AdminPanel from './pages/admin/AdminPanel.jsx'

/* Wrapper: role guard + Layout in one shot */
function Protected({ children, roles }) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

/* Role-aware 404 fallback (not authenticated → /login; authenticated → role home) */
function NotFoundRedirect() {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={HOME_FOR_ROLE[user.role] || '/login'} replace />
}

function App() {
  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ---------- Organizer ---------- */}
      <Route
        path="/dashboard"
        element={<Protected roles={['organizer']}><Dashboard /></Protected>}
      />
      <Route
        path="/events"
        element={<Protected roles={['organizer']}><Events /></Protected>}
      />
      <Route
        path="/events/:id"
        element={<Protected roles={['organizer']}><EventDetail /></Protected>}
      />
      <Route
        path="/predict"
        element={<Protected roles={['organizer']}><Predict /></Protected>}
      />
      <Route
        path="/sentiment"
        element={<Protected roles={['organizer']}><Sentiment /></Protected>}
      />

      {/* ---------- Participant ---------- */}
      <Route
        path="/home"
        element={<Protected roles={['participant']}><ParticipantHome /></Protected>}
      />
      <Route
        path="/join"
        element={<Protected roles={['participant']}><JoinEvent /></Protected>}
      />
      <Route
        path="/feedback/:eventId"
        element={<Protected roles={['participant']}><SubmitFeedback /></Protected>}
      />
      <Route
        path="/my-feedback"
        element={<Protected roles={['participant']}><MyFeedback /></Protected>}
      />

      {/* ---------- Admin ---------- */}
      <Route
        path="/admin"
        element={<Protected roles={['admin']}><AdminPanel /></Protected>}
      />

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  )
}

export default App
