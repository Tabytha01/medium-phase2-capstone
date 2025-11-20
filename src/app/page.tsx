import Link from 'next/link';
import { prisma } from '../lib/prisma';
import { formatPost } from '../lib/posts';
import PostCard from '../components/PostCard';

export const dynamic = 'force-dynamic'; // Or usage of revalidate

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true
        }
      },
      PostTag: {
        include: {
          Tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 20,
  });

  return posts.map(formatPost);
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <section>
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold">Latest Stories</h2>
                </div>
                
                <div className="flex flex-col">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            No stories published yet. 
                            <Link href="/write" className="text-green-600 hover:underline ml-1">
                                Write the first one!
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>

        <aside className="hidden lg:block space-y-8">
             <div className="sticky top-24">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Recommended Topics</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Technology', 'Programming', 'Data Science', 'Machine Learning', 'Web Development', 'Life', 'Self Improvement'].map(topic => (
                             <Link 
                                key={topic}
                                href={`/explore?search=${topic}`} 
                                className="px-3 py-2 bg-white dark:bg-gray-800 border rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {topic}
                            </Link>
                        ))}
                    </div>
                    <Link href="/explore" className="block mt-4 text-green-600 text-sm hover:underline">
                        See all topics
                    </Link>
                </div>
                
                <div className="mt-8 p-6 border rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Writing on Medium</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        New to writing? Share your ideas with millions of readers.
                    </p>
                    <Link href="/write" className="block w-full py-2 text-center bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-90 transition">
                        Start Writing
                    </Link>
                </div>
             </div>
        </aside>
      </div>
    </div>
  );
}
