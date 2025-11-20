import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useReactions(postId: string) {
  const queryClient = useQueryClient();

  const { data: reactions, isLoading } = useQuery({
    queryKey: ['reactions', postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/reactions?postId=${postId}`);
      return data.data;
    },
    enabled: !!postId,
  });

  const toggleReaction = useMutation({
    mutationFn: async (type: 'LIKE' | 'CLAP') => {
      const { data } = await axios.post('/api/reactions', { postId, type });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions', postId] });
    },
  });

  return { reactions, isLoading, toggleReaction };
}
