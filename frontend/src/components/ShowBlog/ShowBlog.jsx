import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from "dompurify";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import "primeicons/primeicons.css"; // PrimeIcons
import "quill/dist/quill.snow.css"; // Quill CSS for rendering

const ShowBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  const sanitizedContent = blog?.content ? DOMPurify.sanitize(blog.content) : "";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/${slug}`);
        const data = await res.json();
        setBlog(data);

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/views/${slug}`, {
          method: 'PUT',
        });
      } catch (error) {
        console.error('Failed to fetch blog or update views:', error);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
          Blog "{slug}" Not Found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Blog Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-8 mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white text-center mb-6">
            {blog.title}
          </h2>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 dark:text-gray-200">Author:</span>
              <span>{blog.author?.username || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 dark:text-gray-200">Reading Time:</span>
              <span>{blog.readingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 dark:text-gray-200">Views:</span>
              <span>{blog.views}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 dark:text-gray-200">Date:</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt="Blog Visual"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl mt-4 mb-6 shadow-sm"
            />
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <p className='text-white'>Tags: </p>
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs sm:text-sm font-medium px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Blog Content */}
        <div  className=" prose bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 sm:p-8">
          <p
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
           className="ql-editor text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base sm:text-lg"/>
        </div>

      </div>
    </div>
  );
};

export default ShowBlog;