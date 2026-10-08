import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Events from './pages/Events.jsx'
import Predict from './pages/Predict.jsx'
import Sentiment from './pages/Sentiment.jsx'

// Wrapper: protected + inside layout
function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/events"    element={<Protected><Events /></Protected>} />
      <Route path="/predict"   element={<Protected><Predict /></Protected>} />
      <Route path="/sentiment" element={<Protected><Sentiment /></Protected>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
