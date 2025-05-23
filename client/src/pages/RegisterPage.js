import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import ApiBase from '../api/ApiBase';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(`${ApiBase}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      const profileRes = await fetch(`${ApiBase}/profile`, {
        credentials: 'include',
      });
      const userInfo = await profileRes.json();
      setUserInfo(userInfo);
      setRedirect(true);
    } else {
      alert('Registration failed!');
    }
  }

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <form className='register' onSubmit={register}>
      <h1>Register</h1>
      <input
        type='text'
        placeholder='username'
        value={username}
        onChange={ev => setUsername(ev.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        value={password}
        onChange={ev => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
