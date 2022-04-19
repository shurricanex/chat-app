//SERVER
const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)
const { generateMessage, generateUrl } = require('./utils/message')
const { addUser, removeUserById, getUserById, getUsersInRoom } = require('./utils/user')
app.use(express.static(publicDirectoryPath))
io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser(socket.id, username, room)
        if (error) {
            return callback({ error })
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('System','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('System', `${user.username} has joined.`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })


    })
    socket.on('sendMessage', (message, callback) => {
        const user = getUserById(socket.id)
        console.log('id',user);
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })
    socket.on('sendLocation', (coords, callback) => {
        const user = getUserById(socket.id)
        io.to(user.room).emit('locationMessage', generateUrl(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    
    socket.on('disconnect', () => {
        const { user } = removeUserById(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('System',`${user.username} has left the chat`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
    
    
        }
    })
})
server.listen(port, () => {
    console.log('server is running on port: ' + port);
})