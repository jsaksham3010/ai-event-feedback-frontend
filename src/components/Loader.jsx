/**
 * Centered spinner. Drop in during loading states.
 * Props:
 *   text — optional label below the spinner
 *   full — if true, fills the viewport (min-h-screen); else fits container
 */
export default function Loader({ text = 'Loading…', full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        full ? 'min-h-screen' : 'py-12'
      }`}
    >
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      {text && <p className="text-sm text-gray-500 mt-3">{text}</p>}
    </div>
  )
}
