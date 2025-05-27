import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 lg:p-12">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-6">
          About Us
        </h1>

        {/* Introduction */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-center">
          Welcome to <span className="text-indigo-600 dark:text-indigo-400 font-semibold">WeBlog</span>! We are a passionate team of writers, designers, and creators dedicated to delivering insightful and engaging content across technology, lifestyle, health, and entertainment.
        </p>

        {/* Mission Section */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Our mission is to create a platform that educates, inspires, and empowers. We share stories, tips, and experiences to make a positive impact on our readers' lives, fostering a community of curious and engaged individuals.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Why Choose Us?
          </h2>
          <ul className="list-disc ml-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 space-y-2">
            <li>Expertly researched and fact-checked content from industry professionals.</li>
            <li>Diverse topics catering to a wide range of interests and audiences.</li>
            <li>A vibrant community of thoughtful and engaged readers.</li>
            <li>Regularly updated content reflecting the latest trends and insights.</li>
          </ul>
        </div>

        {/* Get In Touch Section */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Have questions, suggestions, or just want to connect? Reach out to us! We're always excited to hear from our readers.
          </p>
          <div className="text-center">
            <Link
              to="/Contact"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Closing Note */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">
          Thank you for visiting <span className="text-indigo-600 dark:text-indigo-400 font-semibold">WeBlog</span>. We hope you enjoy our content and become part of our community!
        </p>
      </div>
    </div>
  );
};

export default About;