export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  tags: Array<{ id: string; name: string; slug: string }>;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
}
