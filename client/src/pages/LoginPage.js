import { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import ApiBase from '../api/ApiBase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiBase}/login`, {
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
        toast.success('Login successful');
        setRedirect(true);
      } else {
        toast.error('ACCESS DENIED: Wrong credentials');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <div className='min-h-screen bg-white p-4 flex items-center justify-center'>
      <div className='w-full max-w-md border-4 border-black shadow-[8px_8px_0_0_black] bg-white p-8'>
        {/* Brutalist Header */}
        <div className='mb-8 text-center border-b-4 border-black pb-4'>
          <h1 className='text-3xl font-bold uppercase tracking-tighter'>
            LOGIN
          </h1>
          <p className='font-mono mt-2'>ENTER YOUR CREDENTIALS</p>
        </div>

        {/* Form */}
        <form onSubmit={login} className='space-y-6'>
          {/* Username Field */}
          <div>
            <label className='block font-mono uppercase text-sm mb-2'>
              USERNAME
            </label>
            <div className='relative'>
              <input
                type='text'
                value={username}
                onChange={ev => setUsername(ev.target.value)}
                className='w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-purple-600 bg-white'
                required
                disabled={isLoading}
              />
              <div className='absolute right-3 top-3.5 text-black'>
                <span className='font-mono'>@</span>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className='block font-mono uppercase text-sm mb-2'>
              PASSWORD
            </label>
            <div className='relative'>
              <input
                type='password'
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className='w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-purple-600 bg-white'
                required
                disabled={isLoading}
              />
              <div className='absolute right-3 top-3.5 text-black'>
                <span className='font-mono'>#</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3 px-4 bg-black text-white font-mono uppercase tracking-wider hover:bg-purple-800 transition-colors border-2 border-black relative'>
            {isLoading ? (
              <>
                <span className='opacity-0'>SIGN IN</span>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin'></div>
                </div>
              </>
            ) : (
              'SIGN IN'
            )}
          </button>
        </form>

        {/* Brutalist Footer */}
        <div className='mt-6 text-center font-mono text-sm border-t-2 border-black pt-4'>
          <p>
            NO ACCOUNT?{' '}
            <Link
              to='/register'
              className='font-bold text-purple-600 hover:text-black'>
              REGISTER →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
