import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    <div className='border-4 border-black shadow-[8px_8px_0_0_black] hover:shadow-[12px_12px_0_0_black] transition-all bg-white group'>
      {/* Image */}
      <div className='border-b-4 border-black relative h-64 overflow-hidden'>
        <Link to={`/post/${_id}`}>
          <img
            src={cover.url}
            alt={title}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
          />
          <div className='absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/70 to-transparent'></div>
        </Link>
      </div>

      {/* Content container */}
      <div className='p-5'>
        <Link to={`/post/${_id}`}>
          <h2 className='text-2xl font-bold uppercase tracking-tight mb-3 hover:text-purple-700 transition-colors'>
            {title}
            <span className='block w-0 h-1 bg-purple-600 transition-all duration-300 group-hover:w-full mt-1'></span>
          </h2>
        </Link>

        {/* Author/date*/}
        <div className='flex items-center space-x-3 mb-4'>
          <div className='w-8 h-8 bg-purple-600 flex items-center justify-center text-white font-bold'>
            {author?.username?.charAt(0).toUpperCase()}
          </div>
          <div className='font-mono text-sm'>
            <p className='font-bold'>{author?.username}</p>
            <time className='text-gray-600'>
              {format(new Date(createdAt), 'MMM d, yyyy')}
            </time>
          </div>
        </div>

        {/* Summary*/}
        <p className='font-mono mb-5 line-clamp-3 border-l-4 border-purple-600 pl-3'>
          {summary}
        </p>

        {/* Read more link*/}
        <Link
          to={`/post/${_id}`}
          className='inline-block px-5 py-2 bg-black text-white font-mono uppercase tracking-wider hover:bg-purple-900 transition-colors border-2 border-black'>
          READ MORE →
        </Link>
      </div>
    </div>
  );
}
