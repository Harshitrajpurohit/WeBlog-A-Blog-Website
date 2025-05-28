import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Reader',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // Added for success feedback
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAlreadyLoggedIn(true);
      setSuccessMessage('You are already logged in. Redirecting to homepage...');
      setTimeout(() => {
        navigate('/'); // Navigate without reload
      }, 3000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { fullName, username, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, username, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Update state to reflect logged-in status
        setAlreadyLoggedIn(true);
        setSuccessMessage('Registration successful! Redirecting to homepage...');
        setLoading(false);
        // Navigate after 3 seconds to show success message
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setLoading(false);
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoading(false);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  // Show success message or already logged-in message
  if (alreadyLoggedIn || successMessage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            {successMessage || "You're already logged in"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
            Redirecting in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
          Register
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm sm:text-base text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              >
                <option value="Reader">Reader</option>
                <option value="Creator">Creator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Confirm Password
              </label>
              <input
                type="password" // Fixed: Changed from type="text" to type="password" for security
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link
            href="/Login"
            className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;