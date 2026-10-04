import api from './api'

/**
 * Admin-only HTTP wrappers for /api/admin/*.
 *
 * MOCK FALLBACK:
 *   When an endpoint returns 404 / 5xx / no response, we return pre-shaped
 *   mock data with `isMock: true`. Auth errors (401/403) propagate.
 *
 *   MODEL NUMBERS in trainingSummary / mlModelComparison / nlpSummary are
 *   the REAL results reported by the team:
 *     - Random Forest  : R²=0.4477, MAE=1.4769, RMSE=1.8764, 800 rows
 *     - Linear SVM NLP : accuracy=79.04%, macro F1=0.7215
 *   They are placeholders only in the sense that they come from notebooks,
 *   not from a live API yet.
 *
 * LIST ENDPOINTS (organizations, users):
 *   Not part of the original contract. If /api/admin/organizations or
 *   /api/admin/users exist, use them. Otherwise, show empty list + isMock
 *   flag so the page renders an honest "endpoint pending" state.
 */

const MOCK = {
  platformStats: {
    total_orgs:        0,
    total_users:       0,
    total_events:      0,
    total_feedback:    0,
    total_predictions: 0,
  },
  organizations: {
    organizations: [],   // intentionally empty — no fabrication
  },
  users: {
    users: [],           // intentionally empty — no fabrication
  },
  trainingSummary: {
    ml: {
      model:         'Random Forest',
      target:        'Satisfaction_Score',
      test_r2:       0.4477,
      test_mae:      1.4769,
      test_rmse:     1.8764,
      training_rows: 800,
    },
    nlp: {
      model:    'Linear SVM',
      dataset:  'Twitter US Airline Sentiment',
      accuracy: 0.7904,
      f1_macro: 0.7215,
      labels:   ['negative', 'neutral', 'positive'],
    },
  },
  mlFeatureImportance: { features: [] },
  mlModelComparison: {
    models: [{ name: 'Random Forest', r2: 0.4477, mae: 1.4769, rmse: 1.8764 }],
  },
  nlpSummary: {
    accuracy:     0.7904,
    f1:           0.7215,
    labels:       ['negative', 'neutral', 'positive'],
    top_keywords: [],
  },
}

const fetchOrMock = async (url, mockKey) => {
  try {
    const { data } = await api.get(url)
    return { ...data, isMock: false }
  } catch (err) {
    const status = err?.response?.status
    const noResponse = !err?.response
    if (noResponse || status === 404 || (status >= 500 && status < 600)) {
      // eslint-disable-next-line no-console
      console.info(`[adminService] ${url} unavailable — using mock data`)
      return { ...MOCK[mockKey], isMock: true }
    }
    throw err
  }
}

const adminService = {
  /** GET /api/admin/platform-stats */
  getPlatformStats: () =>
    fetchOrMock('/api/admin/platform-stats', 'platformStats'),

  /** GET /api/admin/organizations  — may not exist yet */
  getOrganizations: () =>
    fetchOrMock('/api/admin/organizations', 'organizations'),

  /** GET /api/admin/users — may not exist yet */
  getUsers: () =>
    fetchOrMock('/api/admin/users', 'users'),

  /** GET /api/admin/training-summary */
  getTrainingSummary: () =>
    fetchOrMock('/api/admin/training-summary', 'trainingSummary'),

  /** GET /api/admin/ml/feature-importance */
  getMLFeatureImportance: () =>
    fetchOrMock('/api/admin/ml/feature-importance', 'mlFeatureImportance'),

  /** GET /api/admin/ml/model-comparison */
  getMLModelComparison: () =>
    fetchOrMock('/api/admin/ml/model-comparison', 'mlModelComparison'),

  /** GET /api/admin/nlp/summary */
  getNLPSummary: () =>
    fetchOrMock('/api/admin/nlp/summary', 'nlpSummary'),
}

export default adminService
