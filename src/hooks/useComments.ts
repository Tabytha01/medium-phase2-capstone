'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  replies?: Comment[];
}

export function useComments(postId: string) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!session) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          postId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setComments(prev => [data.data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addReply = async (parentId: string, content: string) => {
    if (!session) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          postId,
          parentId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === parentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), data.data]
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    loading,
    addComment,
    addReply,
    refetch: fetchComments,
  };
}