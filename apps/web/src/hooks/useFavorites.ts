import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import type { IndicatorCardDTO } from '@/types/api';

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await apiClient.get<IndicatorCardDTO[]>('/indicators/favorites');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}