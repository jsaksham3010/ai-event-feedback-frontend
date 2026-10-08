import api from './api'

/**
 * Admin-only HTTP wrappers for /api/admin/*.
 *
 * MOCK FALLBACK:
 *   When an endpoint returns 404 / 5xx / no response, we return pre-shaped
 *   mock data with `isMock: true`. Auth errors (401/403) propagate.
 *
 *   NLP metrics are REAL results reported by the team:
 *     - Linear SVM NLP : accuracy=79.04%, macro F1=0.7215
 *   Placeholders in the sense they come from notebooks, not a live API.
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
  nlpSummary: {
    model:        'Linear SVM',
    dataset:      'Twitter US Airline Sentiment',
    accuracy:     0.7904,
    f1:           0.7215,
    f1_macro:     0.7215,
    labels:       ['negative', 'neutral', 'positive'],
    top_keywords: [
      { word: 'flight',    count: 4606 },
      { word: 'cancelled', count: 1065 },
      { word: 'service',   count: 999  },
      { word: 'customer',  count: 942  },
      { word: 'bag',       count: 770  },
    ],
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

  /** GET /api/admin/organizations */
  getOrganizations: () =>
    fetchOrMock('/api/admin/organizations', 'organizations'),

  /** GET /api/admin/users */
  getUsers: () =>
    fetchOrMock('/api/admin/users', 'users'),

  /** GET /api/admin/nlp/summary */
  getNLPSummary: () =>
    fetchOrMock('/api/admin/nlp/summary', 'nlpSummary'),
}

export default adminService
