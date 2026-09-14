function Dashboard() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Predictions Made</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Feedback Analyzed</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
      <p className="mt-8 text-gray-500">
        Navbar aur Sidebar agle cells mein add karenge.
      </p>
    </div>
  )
}

export default Dashboard
