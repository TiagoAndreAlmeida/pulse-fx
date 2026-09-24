export const API_ENDPOINTS = {
  INDICATORS: '/indicators',
  INDICATORS_FAVORITES: '/indicators/favorites',
  INDICATOR_DETAIL: (id: string) => `/indicators/${id}`,
  TOGGLE_FAVORITE: (id: string) => `/indicators/${id}/favorite`,
} as const;