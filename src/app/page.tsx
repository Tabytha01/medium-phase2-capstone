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
        // Always show all published posts on home page
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
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
                    <h2 className="text-xl text-[#1A3D63] font-bold">Latest Stories</h2>
                </div>
                
                <div className="flex flex-col">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            No stories available yet.
                        </div>
                    )}
                </div>
            </section>
        </div>

        <aside className="hidden lg:block space-y-8">
             <div className="sticky top-24">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-900 to-purple-300 rounded-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Start Reading</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Discover amazing stories from writers around the world
                        </p>
                        <Link href="/explore" className="inline-block px-6 py-2 bg-[#1A3D63] text-white rounded-full hover:bg-blue-900 transition">
                            Explore Stories
                        </Link>
                    </div>
                </div>
                
                <div className="mt-8 p-6 border rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Forgotten Stories, Found Again</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        New to writing? Share your ideas with millions of readers.
                    </p>
                    <Link href="/write" className="block w-full py-2 text-center bg-[#1A3D63] dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-90 transition">
                        Start Writing
                    </Link>
                </div>
             </div>
        </aside>
      </div>
    </div>
  );
}