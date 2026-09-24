export const API_ENDPOINTS = {
  INDICATORS: '/indicators',
  INDICATORS_FAVORITES: '/indicators/favorites',
  INDICATOR_DETAIL: (id: string) => `/indicators/${id}`,
  TOGGLE_FAVORITE: (id: string) => `/indicators/${id}/favorite`,
  ADMIN_SYNC: '/admin/sync',
} as const;

export const ADMIN_API_KEY_HEADER = 'x-admin-key';