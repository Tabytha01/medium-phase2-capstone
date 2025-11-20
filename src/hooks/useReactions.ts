'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Reaction {
  id: string;
  type: 'CLAP' | 'LIKE';
  userId: string;
  postId: string;
  createdAt: string;
}

export function useReactions(postId: string) {
  const { data: session } = useSession();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [userReaction, setUserReaction] = useState<Reaction | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/reactions?postId=${postId}`);
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
    if (!session) return;

    setLoading(true);
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          type,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Optimistic update
        if (userReaction?.type === type) {
          // Remove reaction
          setReactions(prev => prev.filter(r => r.id !== userReaction.id));
          setUserReaction(null);
        } else {
          // Add or update reaction
          const newReaction = {
            id: data.data.id,
            type,
            userId: session.user?.id || '',
            postId,
            createdAt: new Date().toISOString(),
          };
          
          if (userReaction) {
            // Update existing reaction
            setReactions(prev => 
              prev.map(r => r.id === userReaction.id ? newReaction : r)
            );
          } else {
            // Add new reaction
            setReactions(prev => [...prev, newReaction]);
          }
          
          setUserReaction(newReaction);
        }
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [postId, session]);

  return {
    reactions,
    userReaction,
    loading,
    toggleReaction,
    refetch: fetchReactions,
  };
}