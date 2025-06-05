import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Card from '../Card/Card'
import Hero from '../../sections/Hero';
import TopBlogs from '../../sections/TopBlogs';
import Reviews from '../../sections/Reviews';




const Home = () => {

  const [blogs, setBlogs] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/top`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Fetching blogs failed:', error);
        setBlogs([]);
      }
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/header?email=${parsed.email}`)
        .then(res => res.json())
        .then(userData => {
          setRole(userData.role || '');
        })
        .catch(err => console.error('Error fetching role:', err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Background Image */}
      <Hero role={role}/>

      {/* Featured Blogs Section */}
      <TopBlogs blogs={blogs}/>


      <Reviews/>


    </div>
  );
};

export default Home;