import { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard.jsx'
import Loader from '../../components/Loader.jsx'
import ErrorBox from '../../components/ErrorBox.jsx'
import adminService from '../../services/adminService.js'

/* ---------- Helpers ---------- */

const fmt = (n, d = 4) =>
  n == null || Number.isNaN(Number(n)) ? '—' : Number(n).toFixed(d)

const fmtPct = (n) =>
  n == null || Number.isNaN(Number(n)) ? '—' : `${(Number(n) * 100).toFixed(2)}%`

/* ---------- Main component ---------- */

function ModelTraining() {
  const [nlp, setNlp]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [isMock, setIsMock]   = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const n = await adminService.getNLPSummary()
      setNlp(n)
      setIsMock(Boolean(n.isMock))
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

  const nlpInfo = nlp || {}
  const topKeywords = nlpInfo.top_keywords || []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Model Training
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Sentiment classification model performance and evaluation metrics.
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
            The <code className="bg-yellow-100 px-1 rounded">/api/admin/nlp/summary</code>{' '}
            endpoint metrics are the real team results from the training notebook.
          </p>
        </div>
      )}

      {/* ================================================================
          NLP SECTION — Sentiment Classification
          ================================================================ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💬</span>
          <h3 className="text-lg font-semibold text-gray-800">
            Sentiment Classification Model
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            label="Classes"
            value={(nlpInfo.labels || []).length || '—'}
            icon="🏷️"
            subtext={(nlpInfo.labels || []).join(' · ') || 'No labels'}
            color="text-primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dataset + top keywords */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-md font-semibold mb-3">Dataset</h4>

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

          {/* Evaluation chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-md font-semibold mb-3">Evaluation Chart</h4>
            {nlpInfo.confusion_matrix_url ? (
              <img
                src={nlpInfo.confusion_matrix_url}
                alt="Confusion matrix"
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
        Sentiment classification using TF-IDF features · Labels and metrics
        sourced from the team&apos;s NLP training notebook.
      </p>
    </div>
  )
}

export default ModelTraining
