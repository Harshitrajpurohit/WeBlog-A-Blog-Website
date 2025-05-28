import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Card from '../Card/Card'   

const Home = () => {
  
  const [blogs, setBlogs] = useState([]);
  const [role, setRole] = useState('');

 useEffect(() => {
  async function fetchBlogs() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/top`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Fetching blogs failed:', error);
      setBlogs([]);
    }
  }
  fetchBlogs();
}, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/header?email=${parsed.email}`)
        .then(res => res.json())
        .then(userData => {
          setRole(userData.role || '');
        })
        .catch(err => console.error('Error fetching role:', err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-72 sm:h-96 lg:h-[28rem] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Discover Amazing Blogs
          </h1>
          <p className="text-md sm:text-xl text-gray-200 mb-6 max-w-2xl drop-shadow-md">
            Explore a world of stories, insights, and ideas from creators like you.
          </p>
          {role === 'Creator' && (
            <Link
              to="/CreateBlog"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
            >
              Create Your Blog
            </Link>
          )}
        </div>
      </div>

      {/* Featured Blogs Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Featured Blogs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="flex justify-center">
              <Card blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;