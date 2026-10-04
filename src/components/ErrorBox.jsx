/**
 * Error banner with optional retry.
 * Props:
 *   message  — main error text
 *   onRetry  — optional callback; renders a Retry button if provided
 *   title    — optional bold heading (default: "Something went wrong")
 */
export default function ErrorBox({
  message,
  onRetry,
  title = 'Something went wrong',
}) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      {title && <p className="font-semibold text-sm mb-1">{title}</p>}
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs font-medium text-red-700 underline hover:no-underline"
        >
          ↻ Retry
        </button>
      )}
    </div>
  )
}
