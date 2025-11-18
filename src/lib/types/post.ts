export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  status: "draft" | "published";
}
