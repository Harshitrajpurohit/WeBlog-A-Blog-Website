import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async (currentPage) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog?page=${currentPage}&limit=9`);
      const data = await response.json();

      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">
          All Blogs
        </h1>

        {/* Blog Grid */}
        {loading ? (
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading blogs...</p>
        ) : Array.isArray(blogs) && blogs.length > 0 > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="flex justify-center">
                  <Card blog={blog} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pt-10 flex justify-center">
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChange}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#fff',
                      borderColor: '#4a6b9d',
                      backgroundColor: '#1e2a44',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#1565c0',
                      color: '#fff',
                      borderColor: '#1565c0',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1976d2',
                      },
                    },
                    '& .MuiPaginationItem-root:hover': {
                      backgroundColor: '#2e3b55',
                      borderColor: '#5a8dee',
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: '#b0bec5',
                    },
                    '& .MuiPaginationItem-previousNext': {
                      borderColor: '#4a6b9d',
                      backgroundColor: '#1e2a44',
                      '&:hover': {
                        backgroundColor: '#2e3b55',
                        borderColor: '#5a8dee',
                      },
                    },
                  }}
                />
              </Stack>
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">No blogs available.</p>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
