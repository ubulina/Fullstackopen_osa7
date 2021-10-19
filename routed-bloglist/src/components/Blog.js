import React, { useState } from 'react'

import {    
    TextField,
    Button    
} from '@material-ui/core'

const Blog = ({ blog, addLike, createComment }) => {

    const [comment, setComment] = useState('')
    
    const addComment = (event) => {
      event.preventDefault()
  
      createComment({
          id: blog.id,
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes,
          comments: comment
      })
  
      setComment('')
  }
  
        
    return (
  
      <div>
  
        <div>
            <h2>{blog.title} by {blog.author}</h2>
  
            <a href={`"${blog.url}"`}>{blog.url}</a><br />
            
  
            likes {blog.likes}  <Button variant="outlined" size="small" onClick={addLike}>like</Button><br />
            added: {blog.user.name}<br />
            
        </div>
  
        <div>
  
            <h3>comments</h3>
  
            <form onSubmit={addComment}>
              <div>
                  <TextField
                      variant="outlined"
                      size="small" 
                      type="text" 
                      value={comment} 
                      onChange={({ target }) => setComment(target.value)}
                  />
              </div>
             <div>
              <Button variant="contained" size="small" type="submit">add comment</Button>
              </div>
            </form>
  
        </div>
  
        <div>
      
            <ul>
              {blog.comments.map(comment =>
                <li> {comment} </li>
              )}
            </ul>
  
        </div>
  
      </div>
  
    )
}

export default Blog
  