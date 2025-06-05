import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import Card from '../Card/Ca'


const Hero = ({role}) => {

  return (
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
  );
};

export default Hero;