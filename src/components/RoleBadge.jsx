/**
 * Small colored pill showing a role.
 * Usage: <RoleBadge role={user.role} />  or  <RoleBadge role="organizer" />
 */
const ROLE_STYLES = {
  organizer:   { label: "Organizer",   cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  participant: { label: "Participant", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  admin:       { label: "Admin",       cls: "bg-rose-100 text-rose-700 border-rose-200" },
};

export default function RoleBadge({ role, className = "" }) {
  const style = ROLE_STYLES[role] || {
    label: role || "user",
    cls: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center text-[11px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full border ${style.cls} ${className}`}
    >
      {style.label}
    </span>
  );
}
