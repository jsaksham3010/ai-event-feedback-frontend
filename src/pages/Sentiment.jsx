import { useState } from 'react'
import { analyzeSentiment } from '../services/nlpService.js'

const sentimentColors = {
  positive: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-500',
  },
  negative: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-500',
  },
  neutral: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-500',
  },
}

function Sentiment() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await analyzeSentiment(text)
      setResult(data)
      // Add to history
      setHistory((prev) => [
        { ...data, id: Date.now(), original_text: text },
        ...prev.slice(0, 9),
      ])
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Analysis failed. Backend must be running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setResult(null)
    setError('')
  }

  const sampleTexts = [
    'The event was absolutely amazing! Best marathon ever.',
    'Terrible organization. Registration took hours.',
    'It was okay, nothing special.',
    'Great volunteers and smooth registration!',
    'Long waiting lines and poor coordination.',
  ]

  const colors = result ? sentimentColors[result.sentiment] || sentimentColors.neutral : null

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-primary">
        Sentiment Analyzer
      </h1>
      <p className="text-gray-500 mb-8">
        Paste participant feedback below to detect sentiment (Positive / Negative / Neutral).
      </p>

      {/* ---- Input Form ---- */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">
            Feedback Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., The event was well organized but parking was chaotic..."
            rows={5}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 self-center">Try:</span>
            {sampleTexts.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setText(s)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
              >
                {s.slice(0, 30)}...
              </button>
            ))}
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* ---- Error ---- */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* ---- Result ---- */}
      {result && colors && (
        <div className={`${colors.bg} ${colors.border} border p-6 rounded-lg mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Result</h2>
            <span className={`${colors.badge} text-white px-4 py-1 rounded-full text-sm font-semibold uppercase`}>
              {result.sentiment}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Original Text</p>
              <p className="text-sm bg-white bg-opacity-60 p-3 rounded-lg">
                {result.text}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Cleaned Text</p>
              <p className="text-sm bg-white bg-opacity-60 p-3 rounded-lg">
                {result.cleaned_text}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6">
            <div>
              <p className="text-xs text-gray-500 uppercase">Confidence</p>
              <p className="text-2xl font-bold">
                {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* ---- Confidence Bar ---- */}
          <div className="mt-4 bg-white bg-opacity-60 rounded-full h-2 overflow-hidden">
            <div
              className={`${colors.badge} h-full transition-all`}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ---- History ---- */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Recent Analyses ({history.length})
          </h2>
          <div className="space-y-3">
            {history.map((item) => {
              const c = sentimentColors[item.sentiment] || sentimentColors.neutral
              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {item.original_text}
                    </p>
                  </div>
                  <span className={`${c.badge} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase flex-shrink-0`}>
                    {item.sentiment}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sentiment
