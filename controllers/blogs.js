const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    if (blog.title === undefined && blog.url === undefined) {
        response.status(400).end()
    } else {
        if (blog.likes === undefined) {
            blog.likes = 0
        }

        blog
            .save()
            .then(result => {
                response.status(201).json(result)
            })
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndRemove(request.params.id)
        .then(blog => {
            response.status(204).end()
        })
        .catch(error => console.log(error))
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const b = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => console.log(error))
})

module.exports = blogsRouter