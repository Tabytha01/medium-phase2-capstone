import axios from "axios";
import type { Post, CreatePostInput } from "@/lib/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const postsApi = {
  create: async (data: CreatePostInput): Promise<Post> => {
    const response = await axios.post(`${API_URL}/api/posts`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePostInput>): Promise<Post> => {
    const response = await axios.put(`${API_URL}/api/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/posts/${id}`);
  },

  getById: async (id: string): Promise<Post> => {
    const response = await axios.get(`${API_URL}/api/posts/${id}`);
    return response.data;
  },

  getAll: async (): Promise<Post[]> => {
    const response = await axios.get(`${API_URL}/api/posts`);
    return response.data;
  },

  getUserPosts: async (): Promise<Post[]> => {
    const response = await axios.get(`${API_URL}/api/posts/my-posts`);
    return response.data;
  },
};
