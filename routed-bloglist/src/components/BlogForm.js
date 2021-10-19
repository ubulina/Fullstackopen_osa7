import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
    TextField,
    Button,
    
  } from '@material-ui/core'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    //App-komponentilta propsina saatu funktio
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url
        })

        setTitle('')
        setAuthor('')
        setUrl('')

    }

    return (
        <div className="formDiv">
            <h2>create new</h2>

            <form id="blog-form" onSubmit={addBlog}>
                <div>
                
                <TextField
                    variant="outlined"
                    size="small"
                    label="title"
                    id="title"
                    type="text"
                    value={title}
                    name="Title"
                    onChange={handleTitleChange}
                />
                </div>
                <div>
                <TextField
                    variant="outlined"
                    size="small"
                    label="author"
                    id="author"
                    type="text"
                    value={author}
                    name="Author"
                    onChange={handleAuthorChange}
                />
                </div>
                <div>
                <TextField
                    variant="outlined"
                    size="small"
                    label="url"
                    id="url"
                    type="text"
                    value={url}
                    name="Url"
                    onChange={handleUrlChange}
                />
                </div>
                <div>
                <Button variant="contained" color="success" type="submit">create</Button>
                </div>
            </form>
        </div>
    )

}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}


export default BlogForm