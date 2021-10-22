const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    // tokenin ekstraktoiva koodi
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } else {
        request.token = null
    }
    next()
}

const userExtractor = (request, response, next) => {
    /* userin ekstraktoiva koodi
    const token = tokenExtractor()

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    request.user = User.findById(decodedToken.id)
    next()
    */
}


module.exports = {
    tokenExtractor,
    userExtractor
}