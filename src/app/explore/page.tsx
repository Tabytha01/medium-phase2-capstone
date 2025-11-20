'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ExplorePostCard from '@/components/ExplorePostCard';
import { Post } from '@/types/post';

function ExploreContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const searchParams = useSearchParams();

  const popularTags = [
    'Technology', 'Programming', 'Data Science', 'Machine Learning', 
    'Web Development', 'Life', 'Self Improvement', 'Business', 'Design', 'AI'
  ];

  useEffect(() => {
    const initialSearch = searchParams.get('search') || '';
    const initialTag = searchParams.get('tag') || '';
    setSearch(initialSearch);
    setSelectedTag(initialTag);
    fetchPosts(initialSearch, initialTag);
  }, [searchParams]);

  const fetchPosts = async (searchQuery = '', tag = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (tag) params.append('tag', tag);
      params.append('limit', '20');
      
      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(search, selectedTag);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    fetchPosts(search, tag === selectedTag ? '' : tag);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Explore Stories</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading stories...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <ExplorePostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No stories found. Try adjusting your search or browse different topics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}