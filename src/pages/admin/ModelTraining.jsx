import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import StatCard from '../../components/StatCard.jsx'
import Loader from '../../components/Loader.jsx'
import ErrorBox from '../../components/ErrorBox.jsx'
import adminService from '../../services/adminService.js'

/* ---------- Small helpers ---------- */

const fmt = (n, d = 4) =>
  n == null || Number.isNaN(Number(n)) ? '—' : Number(n).toFixed(d)

const fmtPct = (n) =>
  n == null || Number.isNaN(Number(n)) ? '—' : `${(Number(n) * 100).toFixed(2)}%`

/* ---------- ML feature importance chart ---------- */

function FeatureImportanceChart({ features }) {
  if (!features || features.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400 text-sm">
        Feature importance data not available yet.
      </div>
    )
  }

  // Sort desc, take top 12 to keep chart readable
  const data = [...features]
    .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
    .slice(0, 12)

  return (
    <ResponsiveContainer width="100%" height={Math.max(240, data.length * 30)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 8, left: 120 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" fontSize={11} />
        <YAxis
          type="category"
          dataKey="name"
          fontSize={11}
          width={110}
        />
        <Tooltip
          formatter={(v) => Number(v).toFixed(4)}
          labelStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="importance" fill="#4F46E5" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? '#4338CA' : '#4F46E5'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- ML model comparison table ---------- */

function ModelComparison({ models }) {
  if (!models || models.length === 0) {
    return (
      <div className="py-6 text-center text-gray-400 text-sm">
        Model comparison data not available yet.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Model</th>
            <th className="text-right px-4 py-2 font-medium">R²</th>
            <th className="text-right px-4 py-2 font-medium">MAE</th>
            <th className="text-right px-4 py-2 font-medium">RMSE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {models.map((m, i) => (
            <tr
              key={m.name || i}
              className={m.best ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}
            >
              <td className="px-4 py-2 font-medium text-gray-800">
                {m.name}
                {m.best && (
                  <span className="ml-2 text-[10px] uppercase bg-primary text-white px-1.5 py-0.5 rounded">
                    Best
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-right font-mono text-gray-700">
                {fmt(m.r2)}
              </td>
              <td className="px-4 py-2 text-right font-mono text-gray-700">
                {fmt(m.mae)}
              </td>
              <td className="px-4 py-2 text-right font-mono text-gray-700">
                {fmt(m.rmse)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Main component ---------- */

function ModelTraining() {
  const [summary, setSummary]       = useState(null)
  const [features, setFeatures]     = useState([])
  const [comparison, setComparison] = useState([])
  const [nlp, setNlp]               = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [isMock, setIsMock]   = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch all four in parallel. Each handles its own mock fallback.
      const [s, f, c, n] = await Promise.all([
        adminService.getTrainingSummary(),
        adminService.getMLFeatureImportance(),
        adminService.getMLModelComparison(),
        adminService.getNLPSummary(),
      ])
      setSummary(s)
      setFeatures(f.features || [])
      setComparison(c.models || [])
      setNlp(n)

      const anyMock = Boolean(s.isMock || f.isMock || c.isMock || n.isMock)
      setIsMock(anyMock)
    } catch (err) {
      const status = err?.response?.status
      setError(
        status === 403 ? 'Admin access required.'
        : status === 401 ? 'Session expired. Please log in again.'
        : err?.response?.data?.error || err?.message || 'Could not load training data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <Loader text="Loading model training data…" />
  if (error)   return <ErrorBox message={error} onRetry={load} title="Could not load training data" />

  const ml  = summary?.ml  || {}
  const nlpInfo = summary?.nlp || nlp || {}
  const topKeywords = nlp?.top_keywords || []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Model Training
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            How the ML and NLP models behind this platform were trained.
          </p>
        </div>
        <button onClick={load} className="text-sm text-primary hover:underline">
          ↻ Refresh
        </button>
      </div>

      {isMock && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-lg mb-4">
          <p className="font-semibold mb-1">Some data is from the notebook, not the API</p>
          <p className="text-xs">
            One or more <code className="bg-yellow-100 px-1 rounded">/api/admin/*</code>{' '}
            endpoints aren&apos;t live yet. Metrics below are the real team results
            from the training notebooks; they will refresh automatically once the
            endpoints ship.
          </p>
        </div>
      )}

      {/* ================================================================
          ML SECTION
          ================================================================ */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📈</span>
          <h3 className="text-lg font-semibold text-gray-800">
            ML Model — Satisfaction Prediction
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            label="Model"
            value={ml.model || 'Random Forest'}
            icon="🌲"
            color="text-primary"
          />
          <StatCard
            label="Test R²"
            value={fmt(ml.test_r2, 4)}
            icon="📐"
            subtext="Higher is better (max 1.0)"
            color="text-primary"
          />
          <StatCard
            label="Test MAE"
            value={fmt(ml.test_mae, 4)}
            icon="📏"
            subtext="Lower is better"
            color="text-yellow-600"
          />
          <StatCard
            label="Training Rows"
            value={ml.training_rows ?? '—'}
            icon="🗂️"
            subtext={ml.target ? `Target: ${ml.target}` : 'Target not set'}
            color="text-secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature importance chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-md font-semibold mb-3">Feature Importance</h4>
            <FeatureImportanceChart features={features} />
          </div>

          {/* Model comparison table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-md font-semibold mb-3">Model Comparison</h4>
            <ModelComparison models={comparison} />
          </div>
        </div>
      </div>

      {/* ================================================================
          NLP SECTION
          ================================================================ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💬</span>
          <h3 className="text-lg font-semibold text-gray-800">
            NLP Model — Sentiment Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            label="Model"
            value={nlpInfo.model || 'Linear SVM'}
            icon="🤖"
            color="text-primary"
          />
          <StatCard
            label="Accuracy"
            value={fmtPct(nlpInfo.accuracy)}
            icon="🎯"
            subtext="On held-out test set"
            color="text-secondary"
          />
          <StatCard
            label="Macro F1"
            value={fmt(nlpInfo.f1_macro ?? nlpInfo.f1, 4)}
            icon="⚖️"
            subtext="Balanced across classes"
            color="text-secondary"
          />
          <StatCard
            label="Labels"
            value={(nlpInfo.labels || []).length || '—'}
            icon="🏷️"
            subtext={(nlpInfo.labels || []).join(' · ') || 'No labels'}
            color="text-primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dataset + top keywords */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-md font-semibold mb-3">NLP Summary</h4>

            {nlpInfo.dataset && (
              <p className="text-xs text-gray-500 mb-4">
                Trained on:{' '}
                <span className="font-medium text-gray-700">
                  {nlpInfo.dataset}
                </span>
              </p>
            )}

            <p className="text-xs uppercase text-gray-500 mb-2">
              Top Keywords
            </p>
            {topKeywords.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-sm">
                Keyword list not available yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topKeywords.slice(0, 20).map((k, i) => {
                  const word  = typeof k === 'string' ? k : k.word
                  const count = typeof k === 'string' ? null : k.count
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {word}
                      {count != null && (
                        <span className="text-xs opacity-60 font-mono">×{count}</span>
                      )}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Confusion matrix / static chart (only if backend provides URL) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-md font-semibold mb-3">Evaluation Chart</h4>
            {nlpInfo.confusion_matrix_url ? (
              <img
                src={nlpInfo.confusion_matrix_url}
                alt="NLP confusion matrix"
                className="w-full rounded-lg border border-gray-100"
              />
            ) : (
              <div className="py-10 text-center text-gray-400 text-sm">
                <p>Confusion matrix image not available yet.</p>
                <p className="text-xs mt-2 text-gray-400">
                  Add <code className="bg-gray-100 px-1 rounded">confusion_matrix_url</code>{' '}
                  to the NLP summary response to display it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footnote */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        ML model trained on structured marathon data · NLP model trained on
        Twitter US Airline Sentiment · Numbers sourced from the team&apos;s
        training notebooks.
      </p>
    </div>
  )
}

export default ModelTraining
