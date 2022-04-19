const users = []
const addUser = (id, username, room ) => {
    const existingUser = users.filter(user => user.username === username && user.room === room)
    if (existingUser.length > 0) {
        return {
            error: 'username is already taken'
        }
    }
    const user = {
        id,
        username,
        room
    }
    console.log('saved user',user)
    users.push(user)
    return { user };
}

const getUserById = (id) => {
    const user = users.find(user => user.id === id)
    if (!user) {
        return {
            error: 'no such user'
        }
    }
    return user;
}

const removeUserById = (id) => {
    const userIndex = users.findIndex(user => user.id === id)
    const removedUser = users[userIndex]
    if (userIndex !== -1) {
        users.splice(userIndex, 1)
        return {user: removedUser}
    }
}

const getUsersInRoom = (roomName) => {
    const usersInRoom = users.filter(user => user.room === roomName)
    if (usersInRoom.length) {
        return usersInRoom
    }
}

module.exports = {
    addUser,
    removeUserById,
    getUserById,
    getUsersInRoom
}