/**
 * Metric card for dashboards.
 * Props:
 *   label    — small uppercase text (e.g., "Total Events")
 *   value    — main number or string
 *   icon     — emoji or small element
 *   subtext  — small gray text below value
 *   color    — Tailwind text color class for the value (default: text-gray-800)
 */
export default function StatCard({
  label,
  value,
  icon,
  subtext,
  color = 'text-gray-800',
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  )
}
