const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs.map(u => u.toJSON()))
    /* before
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
        */
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.user)

    if (body.title === undefined && body.url === undefined) {
        response.status(400).end()
    } else {
        if (body.likes === undefined) {
            body.likes = 0
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })
        const savedBlog = await blog.save()
        
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.json(savedBlog.toJSON())
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