// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, any>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface AuthUser extends User {
  emailVerified?: Date | null;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  replies?: Comment[];
  _count?: {
    replies: number;
  };
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
}

// Reaction Types
export type ReactionType = 'CLAP' | 'LIKE';

export interface Reaction {
  id: string;
  type: ReactionType;
  postId: string;
  userId: string;
  createdAt: string;
  User?: Pick<User, 'id' | 'name'>;
}

export interface CreateReactionInput {
  postId: string;
  type: ReactionType;
}

// Follow Types
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: User;
  following?: User;
}

// Search and Filter Types
export interface SearchFilters {
  search?: string;
  tag?: string;
  authorId?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  page?: number;
  limit?: number;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  status?: number;
  errors?: ValidationError[];
}