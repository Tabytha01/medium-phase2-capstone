import { Metadata } from 'next';
import { Post } from '@/types/post';

const defaultMetadata: Metadata = {
  title: 'Medium Clone - Share Your Stories',
  description: 'A publishing platform where you can share your thoughts, ideas, and stories with the world.',
  keywords: ['blog', 'writing', 'publishing', 'stories', 'articles'],
  authors: [{ name: 'Medium Clone' }],
  creator: 'Medium Clone',
  publisher: 'Medium Clone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Medium Clone',
    title: 'Medium Clone - Share Your Stories',
    description: 'A publishing platform where you can share your thoughts, ideas, and stories with the world.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medium Clone - Share Your Stories',
    description: 'A publishing platform where you can share your thoughts, ideas, and stories with the world.',
    creator: '@mediumclone',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generatePostMetadata(post: Post): Metadata {
  const title = `${post.title} | Medium Clone`;
  const description = post.excerpt || 
    post.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';
  
  return {
    title,
    description,
    keywords: post.tags?.map(tag => tag.name) || [],
    authors: [{ name: post.author?.name || 'Unknown Author' }],
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/posts/${post.slug}`,
      siteName: 'Medium Clone',
      publishedTime: post.publishedAt?.toString(),
      modifiedTime: post.updatedAt.toString(),
      authors: [post.author?.name || 'Unknown Author'],
      tags: post.tags?.map(tag => tag.name),
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: `@${post.author?.name?.toLowerCase().replace(/\s+/g, '') || 'author'}`,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
  };
}

export function generateUserMetadata(user: any): Metadata {
  const title = `${user.name} | Medium Clone`;
  const description = user.bio || `Read stories by ${user.name} on Medium Clone`;
  
  return {
    title,
    description,
    authors: [{ name: user.name }],
    openGraph: {
      type: 'profile',
      title,
      description,
      url: `/profile?user=${user.id}`,
      siteName: 'Medium Clone',
      images: user.avatarUrl ? [
        {
          url: user.avatarUrl,
          width: 400,
          height: 400,
          alt: user.name,
        }
      ] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      creator: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
      images: user.avatarUrl ? [user.avatarUrl] : [],
    },
  };
}

export function generateTagMetadata(tag: string): Metadata {
  const title = `${tag} Stories | Medium Clone`;
  const description = `Discover stories about ${tag} on Medium Clone`;
  
  return {
    title,
    description,
    keywords: [tag, 'stories', 'articles', 'blog'],
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/explore?tag=${tag}`,
      siteName: 'Medium Clone',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export { defaultMetadata };