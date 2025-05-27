const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const Blog = require("./models/BlogS.js");
const User = require("./models/UserS.js");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require('connect-flash');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const port = process.env.PORT || 4000;

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
        maxAge: 1 * 24 * 60 * 60 * 1000,
    }
}));
app.use(flash());

// MongoDB Connection
const dbURL = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbURL);
}

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});



app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  
      // const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = (password == user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
  
      res.status(200).json({ message: 'Login successful', user: { email: user.email } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


  app.post('/api/register', async (req, res) => {
    try {
      const { fullName, username, email, password, role } = req.body;
      if (!fullName || !username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      if (!['Reader', 'Creator'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Email or username already exists' });
      }
      // const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: password,
        role,
        avatar: '',
      });
      const savedUser = await newUser.save();
      res.status(201).json({
        user: { email: savedUser.email, username: savedUser.username, role: savedUser.role, avatar: savedUser.avatar },
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  });



app.get('/api/header', async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ avatar: user.avatar, role : user.role });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.get("/api/blog", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments({});
    const blogs = await Blog.find({})
      .skip(skip)
      .limit(limit)
      .populate('author');

    res.json({
      blogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: page
    });
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    res.status(500).send('Error fetching blog posts');
  }
});

// Top 3 most viewed blogs
app.get("/api/blog/top", async (req, res) => {
  try {
    const topBlogs = await Blog.find({})
      .sort({ views: -1 })
      .limit(3)
      .populate('author');

    res.json(topBlogs);
  } catch (err) {
    console.error("Error fetching top blogs:", err);
    res.status(500).send('Error fetching top blogs');
  }
});


app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const blog = await Blog.findOne({ slug: slug }).populate('author');
      if (!blog) return res.status(404).send("Blog not found");
      res.json(blog);
    } catch (err) {
      console.error("Error fetching blog post:", err);
      res.status(500).send("Server error");
    }
  });
  
  
app.put('/api/blog/views/:slug', async (req, res) => {
    try {
      const blog = await Blog.findOneAndUpdate(
        { slug: req.params.slug },
        { $inc: { views: 1 } },
        { new: true }
      );
      if (!blog) return res.status(404).send('Blog not found');
      res.json({ views: blog.views });
    } catch (err) {
      console.error('Error updating views:', err);
      res.status(500).send('Server error');
    }
  });



app.get('/api/admin/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const blogs = await Blog.find({ author: user._id });

    return res.status(200).json({
      user,
      blogs,
    });
  } catch (err) {
    console.error('Error fetching user or blogs:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});



app.get('/api/profile/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});

app.put('/api/profile/:email', async (req, res) => {
  const { email } = req.params;
  const { username, role, avatar, bio, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.role = role || user.role;
    user.avatar = avatar || user.avatar;
    user.bio = bio || user.bio;

    if (password) {
      user.password = password; 
    }
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user data', error });
  }
});


app.get('/api/blog/check-slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Check if slug exists in database
    const existingBlog = await Blog.findOne({ slug });
    
    res.json({ isAvailable: !existingBlog });
  } catch (error) {
    console.error('Error checking slug:', error);
    res.status(500).json({ error: 'Server error while checking slug' });
  }
});

app.post('/api/blog/create', async (req, res) => {
  try {
    const { title, coverImage, category, content, tags, author, slug, readingTime } = req.body;

    // Validate required fields
    if (!title || !coverImage || !category || !content || !author || !slug) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if slug is unique
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      coverImage,
      category,
      content,
      tags,
      author,
      slug,
      readingTime,
    });

    // Save blog to database
    const savedBlog = await newBlog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      blog: savedBlog,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Server error while creating blog' });
  }
});

app.get('/api/blog/get/:id', async (req, res) => {

  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Server error while fetching blog' });
  }
});



app.put('/api/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, coverImage, category, content, tags, author, slug, readingTime } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (blog.author.toString() !== author) {
      return res.status(403).json({ error: 'Unauthorized to edit this blog' });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, coverImage, category, content, tags, slug, readingTime, updatedAt: new Date() },
      { new: true }
    );
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Server error while updating blog' });
  }
});


app.delete('/api/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }


    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Server error while deleting blog' });
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});


app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
