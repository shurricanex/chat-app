const generateMessage = (username,text) => ({
    username,
    text,
    createdAt: new Date().getTime()
})

const generateUrl = (username,url) => ({
    username,
    url,
    createdAt:  new Date().getTime()
})
module.exports = {
    generateMessage,
    generateUrl
}