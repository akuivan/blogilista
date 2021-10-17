const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogList = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogList[0])
    await blogObject.save()
})


test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogList.length)
})

test('blogs are identified by id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toBeDefined();
});

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'Test',
        author: 'Tester',
        url: 'http://www.test.com',
        likes: 2,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogList.length + 1)
    expect(titles).toContain(
        'Test'
    )
})

test('if likes are undefined, likes are set to 0', async () => {
    const newBlog = {
        title: 'Test',
        author: 'Tester',
        url: 'http://www.test.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogList.length + 1)
    expect(titles).toContain(
        'Test'
    )
})

test('if title and url are undefined, it is a bad request..', async () => {
    const newBlog = {
        author: 'Tester',
        likes: 2
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogList.length)
    
})


afterAll(() => {
    mongoose.connection.close()
})