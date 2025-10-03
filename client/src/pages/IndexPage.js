import ApiBase from '../api/ApiBase';
import Post from '../Post';
import { useEffect, useState } from 'react';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${ApiBase}/post`)
      .then(response => {
        if (!response.ok) throw new Error('Network response failed');
        return response.json();
      })
      .then(data => {
        setPosts(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className='min-h-screen bg-white p-4'>
      {/* Header */}
      <header className='border-b-4 border-black mb-8 pb-4'>
        <h1 className='text-5xl font-bold uppercase tracking-tighter text-center'>
          <span className='bg-black text-white px-2'>LATEST</span> POSTS
        </h1>
      </header>

      {/* Content Area */}
      <main className='max-w-7xl mx-auto'>
        {isLoading ? (
          <div className='grid place-items-center h-64'>
            <div className='text-center'>
              <div className='mx-auto w-16 h-16 border-4 border-black border-t-transparent animate-spin mb-4'></div>
              <p className='font-mono uppercase'>LOADING CONTENT...</p>
            </div>
          </div>
        ) : error ? (
          <div className='border-4 border-black p-8 bg-red-100 text-center'>
            <p className='font-bold uppercase text-2xl'>ERROR</p>
            <p className='font-mono mt-2'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-6 py-2 bg-black text-white font-mono uppercase hover:bg-gray-800 transition-colors border-2 border-black'>
              RETRY
            </button>
          </div>
        ) : posts.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map(post => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className='border-4 border-black p-12 text-center'>
            <p className='text-2xl font-mono uppercase'>NO POSTS FOUND</p>
            <p className='mt-2'>Be the first to break the silence.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='border-t-4 border-black mt-12 pt-4 text-center font-mono text-sm'>
        <p>© {new Date().getFullYear()} BLANKINK — NO TRACKING, NO BULLSHIT</p>
      </footer>
    </div>
  );
}
