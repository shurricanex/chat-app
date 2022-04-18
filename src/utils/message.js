const generateMessage = (text) => ({
    text,
    createdAt: new Date().getTime()
})

const generateUrl = (url) => ({
    url,
    createdAt:  new Date().getTime()
})
module.exports = {
    generateMessage,
    generateUrl
}