import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ApiBase from '../api/ApiBase';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('file', files[0]);

      const response = await fetch(`${ApiBase}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Post created successfully');
        setRedirect(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Post creation failed');
      }
    } catch (err) {
      toast.error('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Card */}
        <div className='bg-gray-300 border-4 border-black shadow-[8px_8px_0_0_black] p-6 mb-8'>
          <h1 className='text-3xl font-bold uppercase mb-2 tracking-tight'>
            CREATE POST
          </h1>
          <div className='h-1 w-20 bg-black mb-6'></div>

          <form onSubmit={createNewPost}>
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
                FEATURED IMAGE
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

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-3 px-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors border-2 border-black relative'>
              {isSubmitting ? (
                <>
                  <span className='opacity-0'>PUBLISH</span>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin'></div>
                  </div>
                </>
              ) : (
                'PUBLISH'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
