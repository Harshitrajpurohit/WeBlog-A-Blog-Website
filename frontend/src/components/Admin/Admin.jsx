import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserBlogs from '../UserBlogs/UserBlogs';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isRoleValid, setIsRoleValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = JSON.parse(localStorage.getItem('user'))?.email;

    if (userEmail) {
      fetch(`/api/admin/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user-email': userEmail,
        },
      })
        .then(async (res) => {
          const text = await res.text();

          try {
            const data = JSON.parse(text);
            if (data.user) {
              setUser(data.user);
              setBlogs(data.blogs);

              // Check if the user role is "Creator"
              if (data.user.role !== 'Creator') {
                setIsRoleValid(false); // Invalid role, show message
              }
            } else {
              console.error('User not found');
              navigate('/login');
            }
          } catch (error) {
            console.error('Invalid JSON response:', error);
            navigate('/login');
          }
        })
        .catch((err) => {
          console.error('Error fetching user or blogs:', err);
          navigate('/login');
        });
    } else {
      console.log('No userEmail found in localStorage');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* User Info Section */}
        <div className="text-center mb-12">
          {user ? (
            <>
              {isRoleValid ? (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                    Welcome, {user.username}!
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Create and manage your blog content with ease.
                  </p>
                  <a
                    href="/CreateBlog"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                  >
                    Create New Blog
                  </a>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-bold text-red-600 dark:text-red-400 mb-4">
                    Access Denied
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Your role is "Reader". Update to "Creator" to access the admin area.
                  </p>
                  <a
                    href="/profile"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                  >
                    Edit Your Role
                  </a>
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">Loading user data...</p>
          )}
        </div>

        {/* User Blogs Section */}
        {isRoleValid && blogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center sm:text-left">
              Your Blogs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <UserBlogs key={blog._id} blog={blog} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;