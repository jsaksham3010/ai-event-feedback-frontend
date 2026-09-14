import { useState } from 'react'
import { predictSatisfaction } from '../services/mlService.js'

const initialForm = {
  Age: 30,
  Gender: 'Male',
  Nationality: 'India',
  Previous_Marathon_Participation: 1,
  Registration_Time: 30,
  Race_Category: 'Half-Marathon',
  Payment_Status: 'Paid',
  Completion_Time: 130,
  Distance_Completed: 21,
  Checkpoints_Crossed: 6,
  Pace: 6.5,
  Hydration_Stops_Used: 2,
  Medical_Assistance_Taken: 0,
  Volunteer_Interaction_Score: 7,
  Engagement_Level: 'Highly Engaged',
}

function Predict() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await predictSatisfaction(form)
      setResult(data)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Prediction failed. Backend must be running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setResult(null)
    setError('')
  }

  const numInput = (label, name, min, max, step = 1) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        name={name}
        value={form[name]}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
    </div>
  )

  const selectInput = (label, name, options) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-primary">
        Predict Satisfaction Score
      </h1>
      <p className="text-gray-500 mb-8">
        Enter participant details below to predict their satisfaction score (1-9).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {numInput('Age', 'Age', 18, 90)}
              {selectInput('Gender', 'Gender', ['Male', 'Female', 'Other'])}
              {selectInput('Nationality', 'Nationality',
                ['India', 'USA', 'UK', 'Canada', 'Australia'])}
              {numInput('Previous Marathon (0/1)', 'Previous_Marathon_Participation', 0, 1)}
              {numInput('Registration Time (days)', 'Registration_Time', 1, 60)}
              {selectInput('Race Category', 'Race_Category',
                ['5K', '10K', 'Half-Marathon', 'Full Marathon'])}
              {selectInput('Payment Status', 'Payment_Status',
                ['Paid', 'Pending', 'Discounted'])}
              {numInput('Completion Time (min)', 'Completion_Time', 15, 300)}
              {numInput('Distance Completed (km)', 'Distance_Completed', 5, 42)}
              {numInput('Checkpoints Crossed', 'Checkpoints_Crossed', 1, 9)}
              {numInput('Pace', 'Pace', 3, 10, 0.1)}
              {numInput('Hydration Stops', 'Hydration_Stops_Used', 0, 4)}
              {numInput('Medical Assistance (0/1)', 'Medical_Assistance_Taken', 0, 1)}
              {numInput('Volunteer Interaction (1-9)', 'Volunteer_Interaction_Score', 1, 9)}
              <div className="md:col-span-2">
                {selectInput('Engagement Level', 'Engagement_Level',
                  ['Disengaged', 'Moderately Engaged', 'Highly Engaged'])}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Predicting...' : 'Predict Satisfaction'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Result</h2>

          {!result && !error && !loading && (
            <p className="text-gray-400 text-sm">
              Enter details and click Predict to see the result.
            </p>
          )}

          {loading && (
            <p className="text-gray-500 text-sm">Running prediction...</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Predicted Satisfaction</p>
                <p className="text-4xl font-bold text-secondary">
                  {result.predicted_satisfaction}
                </p>
                <p className="text-xs text-gray-500 mt-1">out of 9</p>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Model:</strong> {result.model}</p>
                <p><strong>Target:</strong> {result.target}</p>
                <p><strong>Version:</strong> {result.model_version}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Predict
