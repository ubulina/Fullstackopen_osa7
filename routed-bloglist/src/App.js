import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import commentService from './services/comments'
import Notification from './components/Notification'
import Errorinfo from './components/Errorinfo'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import {
  Switch, 
  Route, 
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom"

import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  Toolbar,
  AppBar
} from '@material-ui/core'




const Menu = ( {user, handleLogout }) => {
  

  return (

    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {user.name} logged in 
        <Button color="inherit" onClick={handleLogout}>
          logout
        </Button>            
      </Toolbar>
    </AppBar>
  )
}


//komponentti listaa käyttäjät users-tilasta ja muotoilee ne taulukoksi
//saa users-taulukon propsina App-komponentilta
const UserList = ({ users }) => {

   
  return (

  <div>
    <h2>Users</h2>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">        
        <TableHead>
          <TableRow><TableCell>User</TableCell><TableCell>blogs created</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}> {user.name} </Link>
              </TableCell>
              <TableCell>
                {user.blogs.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      
      
  </div>
)}

//komponentti listaa yksittäisen käyttäjän blogit  
const User = ({ users }) => {

  const id = useParams().id
  const user = users.find(u => u.id === String(id))

  if(!user) {
    return null
  }


  return (

      <div>

        <h2>{user.name}</h2>

        <h3>added blogs</h3>

        <TableContainer component={Paper}>
          <Table aria-label="simple table" size="small">
            <TableBody>
              {user.blogs.map(blog => (
                <TableRow key={user.id}>
                  <TableCell>
                    {blog.title} 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </div>
  )
}



const BlogList = ({ blogs, blogForm }) => {

  const byLikes = (b1, b2) => b2.likes - b1.likes
  
    return (
      <div>

        {blogForm()}

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {blogs.sort(byLikes).map(blog => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to= {`/blogs/${blog.id}`}> {blog.title} </Link>
                  </TableCell>
                  <TableCell>
                    {blog.author}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        

      </div>
    )
}



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [users, setUsers] = useState([])
  
  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )

  }, [])

  //kun sivulle tullaan uudestaan, tarkistetaan löytyykö local storagesta
  //tietoja kirjautuneesta käyttäjästä, eli tarkistetaan onko joku kirjautuneena
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) //tieto tokenista asetetaan blogServicelle
    }
  }, [])

  useEffect(() => {
    userService.getAll().then(users =>
      setUsers(users)
    )

  }, [])

  

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
    
      
    setInfoMessage(
      `A new blog '${blogObject.title}' by ${blogObject.author} added`
    )
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)

  }

  
  //toiminnallisuus lähetetään Blog-komponentille propsina
  const addLikeOf = (id) => {
    blogService
      .update(id)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
      })
      .catch(error => console.log(error))
      
  }

  //toiminnallisuus kommentin lisäämistä varten
  //lähetetään Blog-komponentille propsina 
  const addComment = (blogObject) => {

    console.log(blogObject)
    
    commentService
          .create(blogObject)
          .then(returnedBlog => {
            setBlogs(blogs.map(blog => blog.id === blogObject.id ? returnedBlog : blog))
          })
          .catch(error => console.log(error))
    
  }
  
/*
  
  const removeBlog = (id) => {

    const blog = blogs.find(b => b.id === id)

    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {

      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
        })
    }

  }

*/  


  //BlogFormin näkymistä säätelevä funktio
  //funktion sisällä lähetetään BlogFormille addBlog-funktio, joka kommunikoi tietokannan kanssa
  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm
        createBlog={addBlog}
      />
    </Togglable>
  )

  //selvitetään näytettävän blogin id match-muuttujan ja hookin avulla
  const match = useRouteMatch('/blogs/:id')

  //console.log (match)

  const blog = match
    ? blogs.find(blog => blog.id === String(match.params.id))
    : null


  if (user === null) {

    return (
      <Container>
      <div>
        <h2>Log in to application</h2>

        <Errorinfo errorMessage={errorMessage} />

        <form onSubmit={handleLogin}>
          <div>
            <TextField
              variant="outlined"
              size="small"
              label="username"
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <TextField
              variant="outlined"
              size="small"
              label="password"
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <div>
          <Button variant="contained" color="primary" type="submit">login</Button>
          </div>
        </form>
      </div>
      </Container>
    )
  }

  return (
    <Container>
    <div>

      <Menu user={user} handleLogout={handleLogout} />

      <h1>Welcome to the world of interesting blogs</h1>
      
      <Notification message={infoMessage} /> 

      <Switch>
      <Route path="/blogs/:id">
        <Blog blog={blog} addLike={() => addLikeOf(blog.id)} createComment={addComment} user={user} />        
      </Route> 
      <Route path="/users/:id">
        <User users={users} />
      </Route>
      <Route path="/users">
        <UserList users={users} />
      </Route>      
      <Route path="/">
        <BlogList blogs={blogs} blogForm={() => blogForm()} />
      </Route>
      </Switch>
      
    </div>
    </Container>
  )
}

export default App
