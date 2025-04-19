import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { UserContext } from '../UserContext';
import ApiBase from '../api/ApiBase';

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${ApiBase}/post/${id}`)
      .then(response => response.json())
      .then(postInfo => {
        setPostInfo(postInfo);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='border-4 border-black p-8 text-center'>
          <div className='border-2 border-black p-4 inline-block'>
            <div className='border-b-2 border-black w-8 h-8 animate-spin mx-auto'></div>
          </div>
          <p className='mt-4 uppercase font-mono'>LOADING RAW CONTENT...</p>
        </div>
      </div>
    );
  }

  if (!postInfo) return null;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 border-x-4 border-black min-h-screen'>
      {/* Header */}
      <header className='border-b-4 border-black mb-8 pb-6'>
        <h1 className='text-4xl font-bold uppercase tracking-tighter text-center'>
          {postInfo.title}
        </h1>

        <div className='flex items-center justify-center space-x-4 mt-4 font-mono'>
          <div className='flex items-center'>
            <div className='w-8 h-8 border-2 border-black bg-purple-600 flex items-center justify-center text-white font-bold mr-2'>
              {postInfo.author.username.charAt(0).toUpperCase()}
            </div>
            <span>@{postInfo.author.username}</span>
          </div>
          <span>•</span>
          <time>{format(new Date(postInfo.createdAt), 'MMM d, yyyy')}</time>
        </div>
      </header>

      {/* Edit Button */}
      {userInfo?.id === postInfo.author._id && (
        <div className='mb-8 text-center'>
          <Link
            to={`/edit/${postInfo._id}`}
            className='inline-block px-6 py-2 bg-black text-white font-mono uppercase border-2 border-black hover:bg-purple-800 transition-colors'>
            EDIT POST
          </Link>
        </div>
      )}

      {/* Featured Image */}
      <div className='mb-8 border-4 border-black max-w-2xl mx-auto'>
        <img
          src={`${ApiBase}/${postInfo.cover}`}
          alt={postInfo.title}
          className='w-full h-auto object-cover'
        />
      </div>

      {/* Post Content */}
      <article className='prose prose-lg max-w-none font-mono mb-12'>
        <div
          className='border-l-4 border-purple-600 pl-4'
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </article>

      {/* Brutalist Author Card */}
      <div className='border-4 border-black p-6'>
        <div className='flex items-center'>
          <div className='w-12 h-12 border-2 border-black bg-purple-600 flex items-center justify-center text-white font-bold text-xl mr-4'>
            {postInfo.author.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className='font-bold uppercase'>@{postInfo.author.username}</h3>
            <p className='font-mono text-sm'>AUTHOR</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t-4 border-black mt-12 pt-4 text-center font-mono text-sm'>
        <p>© {new Date().getFullYear()} BLANKINK — CREATE FIRE</p>
      </footer>
    </div>
  );
}
