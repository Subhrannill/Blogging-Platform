import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ApiBase from '../api/ApiBase';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${ApiBase}/post/` + id).then(response => {
      response.json().then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
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
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />;
  }

  return (
    <form onSubmit={updatePost}>
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

      <button style={{ marginTop: '5px' }}>Update post</button>
    </form>
  );
}
