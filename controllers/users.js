const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.password === undefined || body.password.length < 3) {
        return response.status(400).json({ error: 'password missing or it is shorter than 3 letters' })
    }
    if (body.username === undefined || body.username.length < 3) {
        return response.status(400).json({ error: 'username missing or it is shorter than 3 letters' })
    } else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save().catch(error => console.log(error))

        response.json(savedUser)
    }
})


usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs')

    // const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter