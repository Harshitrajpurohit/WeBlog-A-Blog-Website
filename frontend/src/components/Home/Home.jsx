import { useEffect, useState } from 'react';
import Hero from '../../sections/Hero';
import TopBlogs from '../../sections/TopBlogs';
import Reviews from '../../sections/Reviews';

const Home = () => {

  const [role, setRole] = useState('');

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
      <Hero role={role} />

      {/* Featured Blogs Section */}
      <TopBlogs />

      <Reviews />

    </div>
  );
};

export default Home;

