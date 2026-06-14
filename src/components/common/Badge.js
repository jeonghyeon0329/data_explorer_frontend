const PRESETS = {
  csv:     'bg-green-900 text-green-300',
  xlsx:    'bg-blue-900  text-blue-300',
  json:    'bg-amber-900 text-amber-300',
  public:  'bg-teal-900  text-teal-300',
  private: 'bg-gray-800  text-gray-400',
  admin:   'bg-yellow-900 text-yellow-300',
  user:    'bg-gray-800  text-gray-400',
};

function Badge({ type, label, className = '' }) {
  const color = PRESETS[type] || 'bg-gray-800 text-gray-400';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color} ${className}`}>
      {label ?? type?.toUpperCase()}
    </span>
  );
}

export default Badge;
