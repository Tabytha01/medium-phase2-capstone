import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPost } from '@/lib/posts';
import CommentSection from '@/components/CommentSection';
import LikeButton from '@/components/LikeButton';

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          bio: true,
        },
      },
      PostTag: {
        include: {
          Tag: true,
        },
      },
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    return null;
  }

  return formatPost(post);
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.publishedAt?.toString(),
      authors: [post.author?.name || 'Unknown'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const readingTime = Math.ceil(post.content.length / 1000);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center space-x-4 mb-6">
          {post.author?.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
              {post.author?.name?.charAt(0)}
            </div>
          )}
          
          <div>
            <Link 
              href={`/profile?user=${post.author?.id}`}
              className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
            >
              {post.author?.name}
            </Link>
            <div className="text-sm text-gray-500 space-x-2">
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Link
                key={tag.id}
                href={`/explore?tag=${tag.slug}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Actions */}
      <div className="border-t border-b py-6 mb-8">
        <div className="flex items-center justify-between">
          <LikeButton postId={post.id} />
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-8">
        <div className="flex items-start space-x-4">
          {post.author?.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
              {post.author?.name?.charAt(0)}
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{post.author?.name}</h3>
            {post.author?.bio && (
              <p className="text-gray-600 dark:text-gray-400 mb-3">{post.author.bio}</p>
            )}
            <Link
              href={`/profile?user=${post.author?.id}`}
              className="text-green-600 hover:underline"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} />
    </article>
  );
}