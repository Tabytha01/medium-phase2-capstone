import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = session?.user?.id === post.authorId;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${post.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Decrement user's post count
          const userKey = `postCount_${session?.user?.id}`;
          const count = Math.max(0, parseInt(localStorage.getItem(userKey) || '0') - 1);
          localStorage.setItem(userKey, count.toString());
          
          alert('Post deleted successfully!');
          window.location.reload();
        }
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  return (
    <div className="group flex flex-col md:flex-row gap-6 py-8 border-b border-gray-100 last:border-0">
      <div className="flex-1 flex flex-col justify-between">
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    {post.author?.image ? (
                        <Image
                            src={post.author.image}
                            alt={post.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {post.author?.name?.charAt(0)}
                        </div>
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.author?.name}</span>
                </div>
                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            ⋯
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                                <Link
                                    href={`/write?edit=${post.id}`}
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    onClick={() => setShowMenu(false)}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Link href={`/posts/${post.slug}`} className="block group-hover:opacity-80 transition">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...'}
                </p>
            </Link>
        </div>

        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>{Math.ceil((post.content.length || 0) / 1000)} min read</span>
                
                <div className="flex gap-2 ml-4">
                    {post.tags?.slice(0, 3).map(tag => (
                        <Link 
                            key={tag.id}
                            href={`/explore?tag=${tag.slug}`} 
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs hover:bg-gray-200"
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="w-full md:w-48 h-32 relative shrink-0 rounded-md overflow-hidden">
             <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
        </Link>
      )}
    </div>
  );
}