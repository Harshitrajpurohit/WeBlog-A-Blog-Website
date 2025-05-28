import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';


const Header = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/header?email=${parsed.email}`)
        .then(res => res.json())
        .then(userData => {
          setAvatar(userData.avatar || '');
          setRole(userData.role || '');
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
        });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setAvatar('');
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const renderAvatar = () => {
    if (avatar) {
      return <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />;
    } else if (user?.name) {
      return <span className="text-base sm:text-lg font-bold text-white">{user.name[0].toUpperCase()}</span>;
    } else {
      return <span className="text-base sm:text-lg font-bold text-white">U</span>;
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              WeBlog
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {['/', '/Blogs', '/About'].map((path, i) => {
                const labels = ['Home', 'Blogs', 'About'];
                return (
                  <li key={path}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `text-sm sm:text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`
                      }
                    >
                      {labels[i]}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* User Actions */}
            <div className="flex items-center">
              {!user ? (
                <Link
                  to="/Login"
                  className="text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                >
                  Log In
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 bg-indigo-600 dark:bg-indigo-800 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                    aria-label="User Menu"
                  >
                    {renderAvatar()}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 overflow-hidden">
                      <Link
                        to="/Profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      {role === 'Creator' && (
                        <Link
                          to="/Admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-800 mt-4 rounded-lg shadow-md">
            <ul className="flex flex-col space-y-2 p-4">
              {['/', '/Blogs', '/About'].map((path, i) => {
                const labels = ['Home', 'Blogs', 'About'];
                return (
                  <li key={path}>
                    <NavLink
                      to={path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm sm:text-base font-medium ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`
                      }
                    >
                      {labels[i]}
                    </NavLink>
                  </li>
                );
              })}
              {user ? (
                <>
                  <li>
                    <Link
                      to="/Profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      Profile
                    </Link>
                  </li>
                  {role === 'Creator' && (
                    <li>
                      <Link
                        to="/Admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm sm:text-base text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/Login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Log In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;