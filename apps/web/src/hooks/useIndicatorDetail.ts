import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { IndicatorDetailDTO } from '@/types/api';

export function useIndicatorDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['indicator', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Indicator ID is required');
      const response = await apiClient.get<IndicatorDetailDTO>(
        API_ENDPOINTS.INDICATOR_DETAIL(id)
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}