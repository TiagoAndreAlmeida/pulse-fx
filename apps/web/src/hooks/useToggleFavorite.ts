import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/api/endpoints';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<{ isFavorite: boolean }>(
        API_ENDPOINTS.TOGGLE_FAVORITE(id)
      );
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      await queryClient.cancelQueries({ queryKey: ['indicators'] });

      const previousFavorites = queryClient.getQueryData(['favorites']);
      const previousIndicators = queryClient.getQueryData(['indicators']);

      queryClient.setQueryData(['favorites'], (old: any[]) => {
        if (!old) return old;
        const exists = old.some((f) => f.id === id);
        if (exists) {
          return old.filter((f) => f.id !== id);
        }
        const indicators = previousIndicators as any[] | undefined;
        const indicator = indicators?.find((ind) => ind.id === id);
        if (indicator) {
          return [...old, { ...indicator, isFavorite: true }];
        }
        return old;
      });

      queryClient.setQueryData(['indicators'], (old: any[]) => {
        if (!old) return old;
        return old.map((ind) =>
          ind.id === id ? { ...ind, isFavorite: !ind.isFavorite } : ind
        );
      });

      return { previousFavorites, previousIndicators };
    },
    onError: (_err, _id, context) => {
      toast.error('Erro ao atualizar favorito', {
        description: 'Tente novamente mais tarde',
      });
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
      if (context?.previousIndicators) {
        queryClient.setQueryData(['indicators'], context.previousIndicators);
      }
    },
    onSuccess: (data) => {
      toast.success(data.isFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
    },
  });
}