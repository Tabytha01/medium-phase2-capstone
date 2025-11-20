export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  bio?: string | null;
}

export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  status: PostStatus;
  publishedAt?: string | Date | null;
  authorId: string;
  author?: User;
  tags?: Tag[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[]; // Array of tag names or IDs
  status?: PostStatus;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  status?: PostStatus;
  authorId?: string;
  search?: string;
  tag?: string;
}
