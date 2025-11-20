import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { formatPost } from '../../../lib/posts';
import LikeButton from '../../../components/LikeButton';
import CommentSection from '../../../components/CommentSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: slug } // Allow lookup by ID as well
      ],
      status: 'PUBLISHED', // Only show published posts
    },
    include: {
      author: {
          select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              bio: true,
          }
      },
      PostTag: {
        include: {
          Tag: true,
        },
      },
    },
  });

  if (!post) return null;
  return formatPost(post);
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      authors: [post.author?.name],
      publishedTime: post.publishedAt?.toString(),
    },
  };
}

export default async function PostPage(props: PageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
            {post.author?.image ? (
                <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                    {post.author?.name?.charAt(0) || 'A'}
                </div>
            )}
            <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {post.author?.name}
                </div>
                <div className="text-sm text-gray-500">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()} · {Math.ceil(post.content.length / 1000)} min read
                </div>
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
          {post.title}
        </h1>

        {post.coverImage && (
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
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

      <div 
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="border-t pt-8 mt-8">
        <div className="flex justify-between items-center mb-8">
            <div className="flex flex-wrap gap-2">
                {post.tags?.map(tag => (
                    <Link 
                        key={tag.id} 
                        href={`/explore?tag=${tag.slug}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>
            <LikeButton postId={post.id} />
        </div>
      </div>
      
      <CommentSection postId={post.id} />
    </article>
  );
}
