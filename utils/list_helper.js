const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((total, blog) => total + blog.likes, 0)
    return total
}

const favoriteBlog = (blogs) => {
    const mostLikes = blogs.reduce((max, blog) => (blog.likes > max ? blog.likes : max),0);
    const favorite = blogs.find(blog => blog.likes === mostLikes)
    return favorite
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}