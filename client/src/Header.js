import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import ApiBase from './api/ApiBase';
import toast from 'react-hot-toast';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${ApiBase}/profile`, { credentials: 'include' })
      .then(response => response.json())
      .then(userInfo => setUserInfo(userInfo));
  }, [setUserInfo]);

  function logout() {
    fetch(`${ApiBase}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    toast.success('Logout successful');
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header className='bg-white border-b-4 border-black shadow-[0_4px_0_0_black] sticky top-0 z-50'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        {/* Logo - Brutalist Style */}
        <Link to='/' className='flex items-center group'>
          <div className='bg-white/20 p-2 rounded-lg mr-1  transition-all duration-300'>
            <img src='/logo.png' alt='Logo' className='w-8 h-8 filter ' />
          </div>
          <span className='text-2xl font-bold uppercase tracking-tighter'>
            <span className='text-black'>BLANK</span>
            <span className='text-purple-600'>INK</span>
          </span>
        </Link>

        <nav className='flex items-center space-x-4'>
          {username ? (
            <>
              {/* Create Post Button */}
              <Link
                to='/create'
                className='px-4 py-2 bg-black text-white font-mono uppercase border-2 border-black hover:bg-purple-600 hover:border-purple-600 transition-colors flex items-center'>
                <span className='mr-2'>+</span>
                CREATE
              </Link>

              {/* User Dropdown */}
              <div className='relative group'>
                <button className='flex items-center space-x-2 focus:outline-none'>
                  <div className='w-8 h-8 border-2 border-black bg-purple-600 flex items-center justify-center text-white font-bold'>
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className='font-mono uppercase text-sm'>
                    {username}
                  </span>
                  <span className='text-black'>▼</span>
                </button>

                {/* Dropdown Menu */}
                <div className='absolute right-0 mt-1 w-48 bg-white border-2 border-black shadow-[4px_4px_0_0_black] py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all'>
                  <button
                    onClick={logout}
                    className='w-full text-left px-4 py-2 text-sm font-mono uppercase hover:bg-purple-100 flex items-center'>
                    <span className='mr-2'>→</span>
                    LOGOUT
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='px-4 py-2 bg-white text-black font-mono uppercase border-2 border-black hover:bg-black hover:text-white transition-colors'>
                LOGIN
              </Link>
              <Link
                to='/register'
                className='px-4 py-2 bg-purple-600 text-white font-mono uppercase border-2 border-black hover:bg-black transition-colors'>
                REGISTER
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
