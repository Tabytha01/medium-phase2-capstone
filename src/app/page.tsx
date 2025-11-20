'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PostCard from '../components/PostCard';
import { Post } from '@/types/post';

export default function Home() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [session]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?status=PUBLISHED');
      const data = await response.json();
      if (data.success) {
        if (session) {
          // Show user's own posts when logged in
          const userPosts = data.data.filter((post: Post) => post.authorId === session.user?.id);
          setPosts(userPosts);
        } else {
          // Show all posts when logged out
          setPosts(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <section>
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold">{session ? 'Your Posts' : 'Latest Stories'}</h2>
                </div>
                
                <div className="flex flex-col">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            {session ? (
                                <>
                                    No posts yet. 
                                    <Link href="/write" className="text-green-600 hover:underline ml-1">
                                        Write your first story!
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-green-600 hover:underline">
                                        Sign in
                                    </Link> to start writing and sharing your stories.
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>

        <aside className="hidden lg:block space-y-8">
             <div className="sticky top-24">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Recommended Topics</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Technology', 'Programming', 'Data Science', 'Machine Learning', 'Web Development', 'Life', 'Self Improvement'].map(topic => (
                             <Link 
                                key={topic}
                                href={`/explore?search=${topic}`} 
                                className="px-3 py-2 bg-white dark:bg-gray-800 border rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {topic}
                            </Link>
                        ))}
                    </div>
                    <Link href="/explore" className="block mt-4 text-green-600 text-sm hover:underline">
                        See all topics
                    </Link>
                </div>
                
                <div className="mt-8 p-6 border rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Writing on Medium</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        New to writing? Share your ideas with millions of readers.
                    </p>
                    <Link href="/write" className="block w-full py-2 text-center bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-90 transition">
                        Start Writing
                    </Link>
                </div>
             </div>
        </aside>
      </div>
    </div>
  );
}