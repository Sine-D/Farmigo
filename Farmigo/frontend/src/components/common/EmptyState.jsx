/** EmptyState.jsx – Friendly empty state with icon, message and optional action */
const EmptyState = ({ icon = "📦", title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="text-6xl mb-4 select-none">{icon}</div>
    <h3 className="text-lg font-bold text-gray-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 max-w-xs">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
