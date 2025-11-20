import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useComments(postId: string) {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/comments?postId=${postId}`);
      return data.data;
    },
    enabled: !!postId,
  });

  const addComment = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { data } = await axios.post('/api/comments', { content, postId, parentId });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await axios.delete(`/api/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return { comments, isLoading, addComment, deleteComment };
}
