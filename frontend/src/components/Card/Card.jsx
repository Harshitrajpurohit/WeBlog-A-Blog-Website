import React from 'react';
import { NavLink } from 'react-router-dom';

const Card = ({ blog }) => {
  return (
    <div className="flex flex-col justify-between w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative">
        <img
          className="w-full h-48 sm:h-56 object-cover"
          src={blog.coverImage || 'https://img.freepik.com/free-photo/technology-communication-icons-symbols-concept_53876-120314.jpg?ga=GA1.1.655091294.1745769183&semt=ais_hybrid&w=740'}
          alt={`Cover for ${blog.title}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>

        {/* Author and Views */}
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
          <span>By <span className="font-medium">{blog.author.username}</span></span>
          <span className="text-gray-400">•</span>
          <span>{blog.views} views</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read Button */}
        <NavLink
          to={`/Blogs/${blog.slug}`}
          className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm sm:text-base shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
        >
          Read More
        </NavLink>
      </div>
    </div>
  );
};

export default Card;