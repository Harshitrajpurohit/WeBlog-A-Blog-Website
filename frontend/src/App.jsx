
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router'

import './App.css'
import Home from './components/Home/Home.jsx'
import Root from './components/Root/Root.jsx'
import About from './components/About/About.jsx'
import AllBlogs from './components/All-blogs/AllBlogs.jsx'
import Admin from './components/Admin/Admin.jsx'
import Login from './components/Forms/Login.jsx'
import Register from './components/Forms/Register.jsx'
import CreateBlog from './components/Forms/CreateBlog.jsx'
import ShowBlog from './components/ShowBlog/ShowBlog.jsx'
import Profile from './components/Profile/Profile.jsx'
import Contact from './components/Contact/Contact.jsx'
import EditBlog from './components/EditBlog/EditBlog.jsx'
import NotFound from './NotFound.jsx';
import { PrimeReactProvider } from 'primereact/api';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Root />}>
      <Route
        index
        element={<Home />}
      />
      <Route path='About' element={<About />} />
      <Route path='Contact' element={<Contact />} />
      <Route path='Blogs' element={<AllBlogs />} />
      <Route path='Admin' element={<Admin />} />
      <Route path='Login' element={<Login />} />
      <Route path='Register' element={<Register />} />
      <Route path='CreateBlog' element={<CreateBlog />} />
      <Route path='EditBlog/:id' element={<EditBlog />} />
      <Route path='Blogs/:slug' element={<ShowBlog />} />
      <Route path='Profile' element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
function App() {

  return (
    <>
      <PrimeReactProvider>
        <RouterProvider router={router} />
      </PrimeReactProvider>
    </>
  )
}

export default App
