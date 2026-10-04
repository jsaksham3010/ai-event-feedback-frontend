import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { HOME_FOR_ROLE } from '../components/ProtectedRoute.jsx'

function Navbar() {
  const { user, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const homeLink = user ? (HOME_FOR_ROLE[user.role] || '/') : '/login'
  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#team', label: 'Team' },
  ]
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
          <span className="text-base font-bold text-gray-900 hidden sm:inline">Event Feedback Analytics</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-indigo-600">{l.label}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <Link to={homeLink} className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">Sign In</Link>
              <Link to="/signup" className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Final Year Project · Inderprastha Engineering College
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
          Turn event feedback into
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">actionable insights</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
          Collect participant feedback, analyze sentiment with NLP, and predict satisfaction with ML — all in one multi-tenant platform built for modern event organizers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link to="/signup" className="w-full sm:w-auto bg-indigo-600 text-white font-medium px-8 py-3.5 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">Start Free →</Link>
          <a href="#how-it-works" className="w-full sm:w-auto bg-white text-gray-700 font-medium px-8 py-3.5 rounded-lg border border-gray-200 hover:border-gray-300">See How It Works</a>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
              <div className="ml-4 bg-white text-xs text-gray-400 px-3 py-0.5 rounded border border-gray-100">ai-event-feedback.app/dashboard</div>
            </div>
            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-lg p-4 text-left">
                  <p className="text-xs text-gray-500 mb-1">NLP Accuracy</p>
                  <p className="text-2xl font-bold text-indigo-600">79.04%</p>
                  <p className="text-xs text-gray-400 mt-1">Linear SVM</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-lg p-4 text-left">
                  <p className="text-xs text-gray-500 mb-1">ML R² Score</p>
                  <p className="text-2xl font-bold text-emerald-600">0.4477</p>
                  <p className="text-xs text-gray-400 mt-1">Random Forest</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-lg p-4 text-left">
                  <p className="text-xs text-gray-500 mb-1">Training Data</p>
                  <p className="text-2xl font-bold text-purple-600">14,640</p>
                  <p className="text-xs text-gray-400 mt-1">Labeled rows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { value: '79.04%', label: 'NLP Accuracy', sub: 'Linear SVM on 14.6k rows' },
    { value: '14,640', label: 'Training Rows', sub: 'Twitter US Airline dataset' },
    { value: '0.4477', label: 'ML R² Score', sub: 'Random Forest regression' },
    { value: '24',     label: 'API Routes',   sub: 'Multi-tenant architecture' },
  ]
  return (
    <section className="border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-sm font-medium text-gray-800 mt-2">{s.label}</p>
              <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: '🧠', title: 'Sentiment Analysis', desc: 'Deep NLP pipeline classifies every feedback into positive, neutral, or negative.', tags: ['NLP', 'Linear SVM', 'TF-IDF'] },
    { icon: '📈', title: 'Satisfaction Prediction', desc: 'Random Forest model predicts satisfaction scores from participant data.', tags: ['ML', 'Random Forest', 'R² 0.4477'] },
    { icon: '🏢', title: 'Multi-Tenant Platform', desc: 'Organizations are fully isolated. Each has its own events, feedback, and analytics.', tags: ['JWT', 'RBAC'] },
    { icon: '🎫', title: 'Event Management', desc: 'Create events, share access codes, and track participation.', tags: ['Events', 'Codes'] },
    { icon: '📊', title: 'Real-Time Analytics', desc: 'Live dashboards with sentiment breakdown, top keywords, and per-event insights.', tags: ['Charts', 'Insights'] },
    { icon: '⚡', title: 'Automated Insights', desc: 'AI-generated summaries flag issues like "high complaint rate".', tags: ['AI', 'Alerts'] },
  ]
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to understand your events</h2>
          <p className="text-gray-600">From collecting raw feedback to surfacing actionable insights.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group bg-white border border-gray-100 rounded-xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map((t, j) => (
                  <span key={j} className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Create an event', desc: 'Organizers sign up, create an event, and get a unique access code.', icon: '📅' },
    { n: '02', title: 'Share the code', desc: 'Participants join with the code — no manual invite lists.', icon: '🔗' },
    { n: '03', title: 'Collect feedback', desc: 'Participants submit free-text feedback. The NLP model analyzes sentiment.', icon: '💬' },
    { n: '04', title: 'Act on insights', desc: 'Organizers see dashboards with sentiment, keywords, and AI-generated alerts.', icon: '🎯' },
  ]
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gray-50/50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">From feedback to insight in four steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">{s.n}</span>
                <span className="text-2xl">{s.icon}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Team() {
  const members = [
    { name: 'Shagun Chaudhary', role: 'NLP & Frontend Engineer', initials: 'SC', color: 'from-indigo-500 to-purple-500', work: 'NLP sentiment model, React frontend, UI/UX' },
    { name: 'Saksham Jain', role: 'ML & Backend Engineer', initials: 'SJ', color: 'from-emerald-500 to-teal-500', work: 'ML pipeline, Flask API, MongoDB architecture' },
  ]
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Team</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built by two engineers, guided by one mentor</h2>
          <p className="text-gray-600">A B.Tech final year project from the Department of Information Technology.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {members.map((m, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-all">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-xl font-bold mb-4`}>{m.initials}</div>
              <h3 className="text-lg font-semibold text-gray-900">{m.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mt-1">{m.role}</p>
              <p className="text-xs text-gray-500 mt-3">{m.work}</p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Under the guidance of</p>
            <h3 className="text-lg font-semibold text-gray-900">Ms. Swati Goel</h3>
            <p className="text-sm text-gray-600 mt-1">Department of Information Technology · Inderprastha Engineering College</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-10 md:p-16 text-center shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full"></div>
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your events?</h2>
            <p className="text-indigo-100 max-w-xl mx-auto mb-8">Create your first event, share a code, and watch insights build themselves.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="w-full sm:w-auto bg-white text-indigo-600 font-semibold px-8 py-3.5 rounded-lg hover:bg-indigo-50 shadow-lg">Get Started Free</Link>
              <Link to="/login" className="w-full sm:w-auto bg-indigo-500/30 backdrop-blur text-white border border-white/30 font-medium px-8 py-3.5 rounded-lg hover:bg-indigo-500/40">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-gray-900">Event Feedback Analytics</span>
            </div>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">AI-powered feedback analytics for modern event organizers.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#features" className="hover:text-indigo-600">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-indigo-600">How It Works</a></li>
              <li><Link to="/signup" className="hover:text-indigo-600">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Project</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#team" className="hover:text-indigo-600">Team</a></li>
              <li><span>Inderprastha Engineering College</span></li>
              <li><span>Session 2026–27</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 AI Event Feedback Analytics · Shagun Chaudhary &amp; Saksham Jain</p>
          <p>Guided by <span className="font-medium text-gray-700">Ms. Swati Goel</span> · Dept. of IT</p>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Team />
      <CTA />
      <Footer />
    </div>
  )
}
