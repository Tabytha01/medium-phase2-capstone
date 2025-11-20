"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PostCard from "@/components/PostCard";
import { Post } from "@/types/post";
import Link from "next/link";

function ProfileContent() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserPosts();
    }
  }, [session]);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch('/api/posts?status=PUBLISHED');
      const data = await response.json();
      if (data.success) {
        const userPosts = data.data.filter((post: Post) => post.authorId === session?.user?.id);
        setPosts(userPosts);
        setStats(prev => ({ ...prev, posts: userPosts.length }));
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleFollow = () => {
    setStats(prev => ({ 
      ...prev, 
      following: prev.following + 1 
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-4xl font-bold">
            {session?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{session?.user?.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Writer and thinker sharing ideas on various topics.
          </p>

          <h2 className="text-2xl font-semibold mb-4">My Posts</h2>
          {loading ? (
            <div className="text-center py-4">Loading posts...</div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400 text-center py-8">
              <p>No posts yet.</p>
              <Link href="/write" className="text-blue-600 hover:underline mt-2 inline-block">
                Write your first story!
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold mb-2">{stats.posts}</p>
          <p className="text-gray-600 dark:text-gray-400">Posts</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold mb-2">{stats.followers}</p>
          <p className="text-gray-600 dark:text-gray-400">Followers</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold mb-2">{stats.following}</p>
          <p className="text-gray-600 dark:text-gray-400">Following</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
