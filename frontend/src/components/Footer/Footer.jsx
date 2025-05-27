import React from 'react';

import { FaRegUser } from "react-icons/fa";
import { LuGithub } from "react-icons/lu";
import { FaLinkedinIn } from "react-icons/fa6";

const links = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/harshit-rajpurohit/" ,
    image:<FaLinkedinIn/>
  },
  {
    name: "GitHub",
    url: "https://github.com/Harshitrajpurohit/",
    image:<LuGithub/>
  },
  {
    name: "Portfolio",
    url: "https://harshit-rajpurohit.vercel.app/" ,
    image:<FaRegUser/>
  }
];


const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
        {/* Copyright Text */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} WeBlog, Inc. All rights reserved.
        </div>

        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          WeBlog
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 sm:space-x-6 justify-center sm:justify-end">
          { links.map((link,index)=>(
              <a 
              key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-md sm:text-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                aria-label={link.name}
              >
                {link.image}
              </a>
          ))     
          }
        </div>
      </div>
    </footer>
  );
};

export default Footer;