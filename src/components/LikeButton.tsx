'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LikeButtonProps {
  postId: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const { data: session } = useSession();
  const [reactions, setReactions] = useState<any[]>([]);
  const [userReaction, setUserReaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchReactions();
    }
  }, [postId, session]);

  const fetchReactions = async () => {
    try {
      const headers: Record<string, string> = {};
      if (session?.user?.id) {
        headers['x-user-id'] = session.user.id;
      }
      
      const response = await fetch(`/api/reactions?postId=${postId}`, { headers });
      const data = await response.json();
      if (data.success) {
        setReactions(data.data.reactions);
        setUserReaction(data.data.userReaction);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const toggleReaction = async (type: 'CLAP' | 'LIKE') => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify({ postId, type }),
      });
      
      if (response.ok) {
        await fetchReactions();
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (!session) return;
    
    setIsAnimating(true);
    await toggleReaction('CLAP');
    setTimeout(() => setIsAnimating(false), 300);
  };

  const clapCount = reactions.filter(r => r.type === 'CLAP').length;
  const hasClapped = userReaction?.type === 'CLAP';

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleClick}
        disabled={!session || loading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
          hasClapped
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
        } ${isAnimating ? 'scale-110' : 'scale-100'} ${
          !session ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <svg
          className={`w-5 h-5 transition-transform ${isAnimating ? 'scale-125' : 'scale-100'}`}
          fill={hasClapped ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
          />
        </svg>
        <span className="font-medium">{clapCount}</span>
      </button>
      
      {!session && (
        <span className="text-xs text-gray-500">Sign in to clap</span>
      )}
    </div>
  );
}