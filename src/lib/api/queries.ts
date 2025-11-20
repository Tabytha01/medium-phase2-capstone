import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { Post, CreatePostInput, UpdatePostInput } from '@/types/post';

// Query Keys
export const queryKeys = {
  posts: ['posts'] as const,
  post: (slug: string) => ['posts', slug] as const,
  comments: (postId: string) => ['comments', postId] as const,
  reactions: (postId: string) => ['reactions', postId] as const,
  userPosts: (userId: string) => ['posts', 'user', userId] as const,
  following: (userId: string) => ['following', userId] as const,
};

// Posts API
export const postsApi = {
  getAll: (params?: any) => api.get('/posts', { params }),
  getBySlug: (slug: string) => api.get(`/posts/${slug}`),
  create: (data: CreatePostInput) => api.post('/posts', data),
  update: (id: string, data: UpdatePostInput) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
};

// Comments API
export const commentsApi = {
  getByPost: (postId: string) => api.get('/comments', { params: { postId } }),
  create: (data: { content: string; postId: string; parentId?: string }) => 
    api.post('/comments', data),
};

// Reactions API
export const reactionsApi = {
  getByPost: (postId: string) => api.get('/reactions', { params: { postId } }),
  toggle: (data: { postId: string; type: 'CLAP' | 'LIKE' }) => 
    api.post('/reactions', data),
};

// Users API
export const usersApi = {
  follow: (userId: string) => api.post(`/users/${userId}/follow`),
  getFollowStatus: (userId: string) => api.get(`/users/${userId}/follow`),
};

// Custom Hooks
export function usePosts(params?: any) {
  return useQuery({
    queryKey: [...queryKeys.posts, params],
    queryFn: () => postsApi.getAll(params),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: () => postsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) => 
      postsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.post(id) });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: () => commentsApi.getByPost(postId),
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: commentsApi.create,
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
    },
  });
}

export function useReactions(postId: string) {
  return useQuery({
    queryKey: queryKeys.reactions(postId),
    queryFn: () => reactionsApi.getByPost(postId),
    enabled: !!postId,
  });
}

export function useToggleReaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reactionsApi.toggle,
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reactions(postId) });
    },
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.follow,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.following(userId) });
    },
  });
}

export function useFollowStatus(userId: string) {
  return useQuery({
    queryKey: queryKeys.following(userId),
    queryFn: () => usersApi.getFollowStatus(userId),
    enabled: !!userId,
  });
}