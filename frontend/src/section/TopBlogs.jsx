import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Card from '../components/Card/Card'


const TopBlgs = ({blogs}) => {

  return (

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
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
  );
};

export default TopBlgs;