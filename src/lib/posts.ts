import { z } from 'zod';
import { CreatePostInput, Post } from '@/types/post';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7);
}

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export function validatePost(data: Partial<CreatePostInput>) {
  const result = postSchema.safeParse(data);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.format(),
    };
  }
  
  return {
    valid: true,
    data: result.data,
  };
}

export function formatPost(post: any): Post {
  return {
    ...post,
    tags: post.PostTag?.map((pt: any) => pt.Tag) || [],
    author: post.author ? {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
      image: post.author.avatarUrl, // Map avatarUrl to image
      bio: post.author.bio,
    } : undefined,
  };
}
