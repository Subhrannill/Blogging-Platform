import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import ApiBase from './api/ApiBase';

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  console.log('Author:', author);
  return (
    <div className='post'>
      <div className='image'>
        <Link to={`/post/${_id}`}>
          <img src={`${ApiBase}/${cover}`} alt='' />
        </Link>
      </div>
      <div className='texts'>
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className='info'>
          <span className='author'>{author?.username}</span>
          <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
        </p>
        <p className='summary'>{summary}</p>
      </div>
    </div>
  );
}
