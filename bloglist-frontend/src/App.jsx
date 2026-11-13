
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Navigation = styled.nav`
  background: #263238;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  border-radius: 6px;
  margin-bottom: 20px;
`

const NavigationLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;

  &:hover {
    color: #80cbc4;
  }
`

const UserInfo = styled.span`
  color: white;
  margin-left: auto;
`

const LogoutButton = styled.button`
  background: #e53935;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #c62828;
  }
`

const NotificationBox = styled.div`
  padding: 12px 16px;
  margin: 15px 0;
  border-radius: 5px;
  border: 2px solid;
  font-weight: bold;

  color: ${props => props.$type === 'success' ? '#1b5e20' : '#b71c1c'};
  background: ${props => props.$type === 'success' ? '#e8f5e9' : '#ffebee'};
  border-color: ${props => props.$type === 'success' ? '#4caf50' : '#e53935'};
`

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <NotificationBox $type={notification.type}>
      {notification.message}
    </NotificationBox>
  )
}

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <div key={blog.id} data-testid="blog">
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        )}
    </div>
  )
}

const BlogPage = ({ blogs, likeBlog, deleteBlog, user }) => {
  const { id } = useParams()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <p>Blog not found</p>
  }

  return (
    <Blog
      blog={blog}
      likeBlog={likeBlog}
      deleteBlog={deleteBlog}
      user={user}
    />
  )
}

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogappUser'
    )

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (notification === null) {
      return
    }

    const timeout = setTimeout(() => {
      setNotification(null)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [notification])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setNotification({
        message: 'Login successful',
        type: 'success'
      })

      navigate('/')
    } catch (error) {
      console.log(error)
      setNotification({
        message: 'wrong username or password',
        type: 'error'
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const handleLike = async (blog) => {
    const updatedBlogData = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id
    }

    try {
      const updatedBlog = await blogService.update(
        blog.id,
        updatedBlogData
      )

      const updatedBlogWithUser = {
        ...updatedBlog,
        user: blog.user
      }

      setBlogs(currentBlogs =>
        currentBlogs.map(b =>
          b.id === blog.id ? updatedBlogWithUser : b
        )
      )
    } catch (error) {
      console.log(error)
      setNotification({
        message: 'liking the blog failed',
        type: 'error'
      })
    }
  }

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!confirmDelete) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs(currentBlogs =>
        currentBlogs.filter(b => b.id !== blog.id)
      )

      setNotification({
        message: `Blog "${blog.title}" deleted successfully`,
        type: 'success'
      })

      navigate('/')
    } catch (error) {
      console.log(error)
      setNotification({
        message: 'deleting the blog failed',
        type: 'error'
      })
    }
  }

  const handleCreate = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)

      setBlogs(currentBlogs =>
        currentBlogs.concat(createdBlog)
      )

      setNotification({
        message: `Blog "${createdBlog.title}" created successfully`,
        type: 'success'
      })

      navigate('/')
    } catch (error) {
      console.log(error)
      setNotification({
        message: 'creating the blog failed',
        type: 'error'
      })
    }
  }

  return (
    <div>
      <Navigation>
        <NavigationLink to="/">blogs</NavigationLink>

        {!user && (
          <NavigationLink to="/login">login</NavigationLink>
        )}

        {user && (
          <>
            <NavigationLink to="/blogs/create">
              create new blog
            </NavigationLink>

            <UserInfo>{user.name} logged in</UserInfo>

            <LogoutButton onClick={handleLogout}>
              logout
            </LogoutButton>
          </>
        )}
      </Navigation>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={<BlogList blogs={blogs} />}
        />

        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" />
              : <LoginForm
                  username={username}
                  password={password}
                  handleUsernameChange={({ target }) => setUsername(target.value)}
                  handlePasswordChange={({ target }) => setPassword(target.value)}
                  handleLogin={handleLogin}
                />
          }
        />

        <Route
          path="/blogs/create"
          element={
            user
              ? <BlogForm
                  createBlog={handleCreate}
                  hideForm={() => navigate('/')}
                />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <BlogPage
              blogs={blogs}
              likeBlog={handleLike}
              deleteBlog={handleDelete}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
