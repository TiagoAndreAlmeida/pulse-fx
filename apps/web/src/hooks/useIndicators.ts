import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { IndicatorCardDTO } from '@/types/api';

export function useIndicators() {
  return useQuery({
    queryKey: ['indicators'],
    queryFn: async () => {
      const response = await apiClient.get<IndicatorCardDTO[]>(API_ENDPOINTS.INDICATORS);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await apiClient.get<IndicatorCardDTO[]>(API_ENDPOINTS.INDICATORS_FAVORITES);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}