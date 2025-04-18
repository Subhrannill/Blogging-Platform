import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ApiBase from '../api/ApiBase';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
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
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type='text'
        placeholder='Title'
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type='text'
        placeholder='Summary'
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input type='file' onChange={ev => setFiles(ev.target.files)} />

      <ReactQuill
        value={content}
        onChange={setContent}
        theme='snow'
        style={{ marginTop: '10px', marginBottom: '10px' }}
      />

      <button style={{ marginTop: '5px' }}>Create post</button>
    </form>
  );
}
