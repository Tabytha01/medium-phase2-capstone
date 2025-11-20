'use client';

import { useState } from 'react';

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  onFollowChange?: (following: boolean) => void;
}

export default function FollowButton({ userId, initialFollowing = false, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      
      // Update following list in localStorage
      const followingList = JSON.parse(localStorage.getItem('following') || '[]');
      if (newFollowingState) {
        if (!followingList.includes(userId)) {
          followingList.push(userId);
        }
      } else {
        const index = followingList.indexOf(userId);
        if (index > -1) {
          followingList.splice(index, 1);
        }
      }
      localStorage.setItem('following', JSON.stringify(followingList));
      
      onFollowChange?.(newFollowingState);
      setLoading(false);
    }, 500);
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-6 py-2 rounded-full font-medium transition ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-green-600 text-white hover:bg-green-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}