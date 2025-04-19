import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ApiBase from '../api/ApiBase';
import toast from 'react-hot-toast';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${ApiBase}/post/` + id).then(response => {
      response.json().then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setIsLoading(false);
      });
    });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('id', id);
      if (files?.[0]) {
        data.set('file', files[0]);
      }

      const response = await fetch(`${ApiBase}/post`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Post updated successfully');
        setRedirect(true);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Post update failed');
      }
    } catch (err) {
      toast.error('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />;
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-100 p-4 flex items-center justify-center'>
        <div className='border-4 border-black bg-gray-300 p-8 text-center shadow-[8px_8px_0_0_black] relative overflow-hidden'>
          {/* Pixel-art style loader */}
          <div className='mx-auto mb-6 grid grid-cols-3 gap-2 w-24'>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className='h-6 bg-black opacity-0 animate-[fadeIn_1.5s_infinite]'
                style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>

          {/* Typography with glitch effect */}
          <div className='relative'>
            <p className='uppercase font-mono text-2xl font-bold tracking-tighter'>
              <span className='block'>LOADING</span>
            </p>
            <p className='absolute top-0 left-0 uppercase font-mono text-2xl font-bold tracking-tighter text-white mix-blend-difference animate-[glitch_1s_linear_infinite]'>
              <span className='block'>LOADING</span>
            </p>
          </div>

          {/* progress indicator */}
          <div className='mt-6 h-2 bg-white border border-black overflow-hidden'>
            <div className='h-full bg-black animate-[progress_2s_linear_infinite] origin-left'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Card */}
        <div className='bg-gray-300 border-4 border-black shadow-[8px_8px_0_0_black] p-6 mb-8'>
          <h1 className='text-3xl font-bold uppercase mb-2 tracking-tight'>
            EDIT POST
          </h1>
          <div className='h-1 w-20 bg-black mb-6'></div>

          <form onSubmit={updatePost}>
            {/* Title Input */}
            <div className='mb-6'>
              <label className='block uppercase font-mono text-sm mb-2'>
                TITLE
              </label>
              <input
                type='text'
                value={title}
                onChange={ev => setTitle(ev.target.value)}
                className='w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-purple-500'
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Summary Input */}
            <div className='mb-6'>
              <label className='block uppercase font-mono text-sm mb-2'>
                SUMMARY
              </label>
              <input
                type='text'
                value={summary}
                onChange={ev => setSummary(ev.target.value)}
                className='w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-purple-500'
                required
                disabled={isSubmitting}
              />
            </div>

            {/* File Upload */}
            <div className='mb-6'>
              <label className='block uppercase font-mono text-sm mb-2'>
                UPDATE IMAGE
              </label>
              <div className='border-2 border-black p-4 bg-white'>
                <input
                  type='file'
                  onChange={ev => setFiles(ev.target.files)}
                  className='w-full'
                  accept='image/*'
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className='mb-8'>
              <label className='block uppercase font-mono text-sm mb-2'>
                CONTENT
              </label>
              <div className='border-2 border-black'>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  theme='snow'
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link'],
                    ],
                  }}
                  className='bg-white'
                  readOnly={isSubmitting}
                />
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Link
                to={'/post/' + id}
                relative='path'
                className='w-full py-3 px-4 bg-zinc-500 text-white font-bold uppercase tracking-wider hover:bg-zinc-700 transition-colors border-2 border-black text-center block'>
                CANCEL
              </Link>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full py-3 px-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors border-2 border-black relative'>
                {isSubmitting ? (
                  <>
                    <span className='opacity-0'>UPDATE POST</span>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin'></div>
                    </div>
                  </>
                ) : (
                  'UPDATE POST'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
