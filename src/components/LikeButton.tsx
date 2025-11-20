"use client";

import { useReactions } from '@/hooks/useReactions';
import { useSession } from 'next-auth/react';

interface LikeButtonProps {
  postId: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const { data: session } = useSession();
  const { reactions, toggleReaction } = useReactions(postId);

  const handleLike = () => {
    if (!session) {
        // Redirect to login or show toast
        alert('Please sign in to like posts');
        return;
    }
    toggleReaction.mutate('LIKE');
  };

  return (
    <button 
        onClick={handleLike}
        className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition"
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.247-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.077.898-.521.898h-.991a4.418 4.418 0 0 0-.989.11l-2.298.602c-.354.092-.71.16-1.069.205a.75.75 0 0 1-.842-.75V7.505a.75.75 0 0 1 .842-.75c.359.045.715.113 1.069.206l2.298.602c.327.086.661.122.989.11h.991c.445 0 .718.498.521.898a9.06 9.06 0 0 1-.27.602m-2.25 7.5 2.25 7.5" />
        </svg>
        <span>{reactions?.likes || 0}</span>
    </button>
  );
}
