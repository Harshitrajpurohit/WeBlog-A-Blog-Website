import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
    avatar: '',
    bio: '',
  });
  const [editField, setEditField] = useState(null);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const maxBioLength = 250;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchUserData(parsedUser.email);
    } else {
      setNotLoggedIn(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [navigate]);

  const fetchUserData = (email) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(data);
          setFormData({
            username: data.username || '',
            email: data.email || '',
            role: data.role || '',
            password: '',
            avatar: data.avatar || '',
            bio: data.bio || '',
          });
        }
      })
      .catch((err) => console.error('Error fetching user data:', err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bio' && value.length > maxBioLength) {
      return; // Enforce 250-character limit
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${user.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((updatedData) => {
        setUser(updatedData);
        setIsEditing(false);
        setEditField(null);
        localStorage.setItem('user', JSON.stringify(updatedData));

        // Set notification based on updated field
        const messages = {
          name: 'Username updated successfully!',
          avatar: 'Profile image updated successfully!',
          role: 'Role updated successfully!',
          password: 'Password updated successfully!',
          bio: 'Bio updated successfully!',
        };
        setNotification(messages[editField] || 'Profile updated successfully!');

        // Clear notification after 3 seconds
        setTimeout(() => setNotification(''), 3000);
      })
      .catch((err) => console.error('Error saving user data:', err));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditField(null);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      role: user.role || '',
      password: '',
      avatar: user.avatar || '',
      bio: user.bio || '',
    });
  };

  if (notLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
          You are not logged in. Redirecting to Login...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6">
          <img
            src={formData.avatar || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg"
          />
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              {user.username}
            </h2>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 space-y-4">
          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200">Role:</span>
                <p className="text-gray-600 dark:text-gray-300">{user.role}</p>
              </div>
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200">Email:</span>
                <p className="text-gray-600 dark:text-gray-300 truncate">{user.email}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium text-gray-800 dark:text-gray-200">Bio:</span>
                <p className="text-gray-600 dark:text-gray-300">{user.bio || 'No bio provided'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {editField === 'name' && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              )}
              {editField === 'avatar' && (
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              )}
              {editField === 'password' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              )}
              {editField === 'role' && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="Creator">Creator</option>
                    <option value="Reader">Reader</option>
                  </select>
                </div>
              )}
              {editField === 'bio' && (
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Bio (max 250 characters)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={maxBioLength}
                    className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-y"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {formData.bio.length}/{maxBioLength} characters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification */}
        {notification && (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center font-medium">
            {notification}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 w-full sm:w-auto"
              >
                Edit Profile
              </button>
              <a
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-200 text-center w-full sm:w-auto"
              >
                Back to Home
              </a>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 w-full sm:w-auto"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {['name', 'avatar', 'role', 'password', 'bio'].map((field) => (
                  <button
                    key={field}
                    onClick={() => setEditField(field)}
                    className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg px-4 py-2 shadow-sm transition-all duration-200 ${
                      editField === field ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''
                    }`}
                  >
                    Edit {field.charAt(0).toUpperCase() + field.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;