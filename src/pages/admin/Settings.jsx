function Settings() {
  const items = [
    {
      icon: '🔐',
      title: 'Authentication',
      description: 'JWT secret, token expiry, OTP email provider.',
    },
    {
      icon: '🧠',
      title: 'Model Paths',
      description: 'Locations of the ML and NLP model files served by Flask.',
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'SMTP configuration for OTP and system notifications.',
    },
    {
      icon: '🗄️',
      title: 'Database',
      description: 'MongoDB connection string and backup policy.',
    },
  ]

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">
          Platform configuration. Coming soon.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-lg mb-6">
        <p className="font-semibold mb-1">Not implemented yet</p>
        <p className="text-xs">
          Settings are managed server-side via environment variables for now.
          This page is a placeholder for a future admin configuration UI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white p-5 rounded-lg shadow opacity-70"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Configure via the Flask backend <code className="bg-gray-100 px-1 rounded">.env</code> file until this UI is built.
      </p>
    </div>
  )
}

export default Settings
