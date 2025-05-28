import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Editor } from 'primereact/editor';
        

const EditBlog = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState(['']);
  const [slug, setSlug] = useState('');
  const [errorsStep1, setErrorsStep1] = useState({});
  const [errorsStep2, setErrorsStep2] = useState({});
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const id  = useParams().id; // Get blog ID from URL
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  const readingTime = wordCount ? `${Math.ceil(wordCount / 200)} min` : '0 min';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userIdFromStorage = user?._id;

    if (!userIdFromStorage) {
      setIsNotLoggedIn(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setUserId(userIdFromStorage);
    }

    // Fetch blog details
    if (id) {
      fetchBlogDetails(id);
    }
  }, [id, navigate]);

const fetchBlogDetails = async (id) => {
  try {
    
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    if (!res.ok) {
      throw new Error('Failed to fetch blog details');
    }

    const blog = await res.json();

    setTitle(blog.title || '');
    setCoverImage(blog.coverImage || '');
    setCategory(blog.category || '');
    setText(blog.content || '');
    setTags(blog.tags.length > 0 ? blog.tags : ['']);
    setSlug(blog.slug || '');
  } catch (err) {
    console.error('Error fetching blog details:', err);
    setErrorsStep1({ general: 'Failed to load blog details. Please try again.' });
  }
};

  const checkSlugAvailability = async (slug, blogId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/check-slug/${slug}?excludeId=${blogId}`);
      const data = await res.json();
      return data.isAvailable;
    } catch (err) {
      console.error('Error checking slug:', err);
      return false;
    }
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };

  const addTag = () => {
    if (tags.length < 3) setTags([...tags, '']);
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const validateStep1 = async () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!coverImage.trim()) errors.coverImage = 'Cover image URL is required';
    if (!category.trim()) errors.category = 'Category is required';
    if (!slug) {
      errors.slug = 'Slug cannot be empty';
    } else {
      const isSlugAvailable = await checkSlugAvailability(slug, id);
      if (!isSlugAvailable) {
        errors.slug = 'This slug is already taken';
      }
    }
    setErrorsStep1(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!text.trim()) errors.text = 'Blog content is required';
    tags.forEach((tag, index) => {
      if (!tag.trim()) {
        errors[`tag${index}`] = `Tag ${index + 1} is required`;
      }
    });
    setErrorsStep2(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (await validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorsStep2({ general: 'User not authenticated' });
      return;
    }

    if (!validateStep2()) return;

    const blogData = {
      title,
      coverImage,
      category,
      content: text,
      tags,
      author: userId,
      slug,
      readingTime,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!res.ok) {
        throw new Error('Failed to update blog');
      }

      const result = await res.json();
      setSuccessMessage('Blog updated successfully!');
      setTimeout(() => navigate('/Admin'), 2000);
    } catch (err) {
      console.error('Error:', err);
      setErrorsStep2({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-6">
        {/* Step Indicator */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className="h-1 w-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>

        {isNotLoggedIn && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm text-center">
            You are not logged in. Redirecting to login page...
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm text-center">
            {successMessage}
          </div>
        )}

        {(errorsStep1.general || errorsStep2.general) && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm text-center">
            {errorsStep1.general || errorsStep2.general}
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-5">
          Edit Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label htmlFor="title" className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  placeholder="Enter blog title"
                />
                {errorsStep1.title && <p className="text-xs text-red-500 mt-1">{errorsStep1.title}</p>}
              </div>

              <div>
                <label htmlFor="slug" className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  placeholder="Enter slug"
                />
                {errorsStep1.slug && <p className="text-xs text-red-500 mt-1">{errorsStep1.slug}</p>}
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Cover Preview"
                    className="mt-2 w-full h-40 object-cover rounded-lg"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image')}
                  />
                )}
                {errorsStep1.coverImage && <p className="text-xs text-red-500 mt-1">{errorsStep1.coverImage}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                  <option value="Finance">Finance</option>
                </select>
                {errorsStep1.category && <p className="text-xs text-red-500 mt-1">{errorsStep1.category}</p>}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-sm"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="text" className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Blog Content
                </label>
                <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px'}} className='text-white' />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Word Count: {wordCount} | Characters: {charCount} | Reading Time: {readingTime}
                </p>
                {errorsStep2.text && <p className="text-xs text-red-500 mt-1">{errorsStep2.text}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Tags (Max 3)
                </label>
                <div className="space-y-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                        placeholder={`Tag ${index + 1}`}
                      />
                      {tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-xs"
                        >
                          ✕
                        </button>
                      )}
                      {errorsStep2[`tag${index}`] && (
                        <p className="text-xs text-red-500 mt-1">{errorsStep2[`tag${index}`]}</p>
                      )}
                    </div>
                  ))}
                  {tags.length < 3 && (
                    <button
                      type="button"
                      onClick={addTag}
                      className="text-xs text-indigo-600 hover:text-indigo-500 font-medium mt-1 transition-colors duration-200"
                    >
                      + Add Tag
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-1/2 ${
                    isSubmitting
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white font-semibold py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 text-sm`}
                >
                  {isSubmitting ? 'Submitting...' : 'Update'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditBlog;