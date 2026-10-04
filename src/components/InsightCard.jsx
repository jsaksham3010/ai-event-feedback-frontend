const SEVERITY_STYLES = {
  high:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    dot: 'bg-red-500'    },
  medium:  { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  low:     { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   dot: 'bg-blue-500'   },
  info:    { bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-800',   dot: 'bg-gray-500'   },
}

/**
 * Colored card for AI-generated insights.
 * Props:
 *   title       — short headline
 *   description — longer explanation
 *   severity    — "high" | "medium" | "low" | "info" (default: "info")
 */
export default function InsightCard({ title, description, severity = 'info' }) {
  const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.info

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${style.text}`}>{title}</p>
          {description && (
            <p className={`text-xs mt-1 ${style.text} opacity-80`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
