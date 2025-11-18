"use client";

import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";

function ProfileContent() {
  const { data: session } = useSession();

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
          <div className="text-gray-600 dark:text-gray-400">
            <p>No posts yet. Start writing to share your thoughts!</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold mb-2">0</p>
          <p className="text-gray-600 dark:text-gray-400">Posts</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold mb-2">0</p>
          <p className="text-gray-600 dark:text-gray-400">Followers</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold mb-2">0</p>
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
