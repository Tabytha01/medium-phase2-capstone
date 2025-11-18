export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to Medium Clone</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          A place to read, write, and deepen your understanding
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">📝 Create Stories</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Write and publish your thoughts with our rich text editor
          </p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">🔍 Discover Content</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore stories from writers on any topic
          </p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">👥 Connect</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Follow authors and engage with the community
          </p>
        </div>
      </section>
    </div>
  );
}
