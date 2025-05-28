import React from 'react';
import { useNavigate } from 'react-router-dom';


const UserBlogs = ({ blog }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/${blog._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          alert('Blog deleted successfully!');
          window.location.reload(); 
        } else {
          throw new Error('Failed to delete blog');
        }
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Blog Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 truncate">
        {blog.title}
      </h3>

      {/* Blog Metadata Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4">
        <div>
          <span className="font-medium text-gray-900 dark:text-white">Views: </span>
          {blog.views}
        </div>
        <div>
          <span className="font-medium text-gray-900 dark:text-white">Category: </span>
          {blog.category}
        </div>
        <div>
          <span className="font-medium text-gray-900 dark:text-white">Reading Time: </span>
          {blog.readingTime}
        </div>
        <div>
          <span className="font-medium text-gray-900 dark:text-white">Created: </span>
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Blog Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={() => navigate(`/EditBlog/${blog._id}`)}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-6 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
        >
          Delete
        </button>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 mt-4">
        {blog.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserBlogs;