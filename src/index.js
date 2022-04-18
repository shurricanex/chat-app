const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)
const {generateMessage, generateUrl} = require('./utils/message');
app.use(express.static(publicDirectoryPath))
io.on('connection',(socket) => {
    socket.broadcast.emit('message','a user has joined the chat')
    socket.on('sendMessage',(message, callback) => {
        io.emit('message',generateMessage(message))
        callback()
    })
    socket.on('sendLocation',(coords, callback) => {
        io.emit('locationMessage',generateUrl(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect',() => {
        io.emit('message', 'a user has left the chat')
    })
})
server.listen(port, () => {
    console.log('server is running on port: ' +port);
})