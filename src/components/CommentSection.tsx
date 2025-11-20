"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useComments } from '@/hooks/useComments';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const { comments, isLoading, addComment, deleteComment } = useComments(postId);
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment.mutate({ content }, {
        onSuccess: () => setContent('')
    });
  };

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments?.length || 0})</h3>
      
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none dark:bg-gray-800 dark:border-gray-700"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button 
                type="submit" 
                disabled={addComment.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition"
            >
                {addComment.isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <p>Please <a href="/api/auth/signin" className="text-green-600 hover:underline">sign in</a> to leave a comment.</p>
        </div>
      )}

      <div className="space-y-6">
        {comments?.map((comment: any) => (
          <div key={comment.id} className="flex gap-4">
            <div className="shrink-0">
                {comment.author?.image ? (
                    <Image
                        src={comment.author.image}
                        alt={comment.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                        {comment.author?.name?.charAt(0)}
                    </div>
                )}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{comment.author?.name}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{comment.content}</p>
              </div>
              
              {session?.user?.email === comment.author?.email && (
                  <button 
                    onClick={() => deleteComment.mutate(comment.id)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 ml-2"
                  >
                    Delete
                  </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
