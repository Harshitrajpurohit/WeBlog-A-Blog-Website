import { useState, useEffect } from 'react';
import Card from '../components/Card/Card'
import ShimmerEffect from '../components/ShimmerEffect/ShimmerEffect';


const TopBlgs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/top`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setBlogs(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetching blogs failed:', error);
        setBlogs([]);
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);


  return (

    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Featured Blogs
      </h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex justify-center">
              <ShimmerEffect />
            </div>
          ))}</div>
      ) :
        (blogs.length > 0 ?
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="flex justify-center">
                <Card blog={blog} />
              </div>
            ))}
          </div> :
          <div className="text-center text-gray-500 mt-6">
            No blogs found or failed to load.
          </div>
        )
      }
    </div >
  );
};

export default TopBlgs;


