import React from 'react'

export default function ShimmerEffect() {
  return (
    <div className="flex flex-col justify-between w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">

      {/* Cover Image Placeholder */}
      <div className="w-full h-48 sm:h-56 bg-gray-300 dark:bg-gray-700" />

      {/* Content Placeholder */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />

        {/* Author & Views */}
        <div className="flex space-x-4">
          <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>

        {/* Tags */}
        <div className="flex space-x-2">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-14 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Read Button */}
        <div className="mt-auto h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}
