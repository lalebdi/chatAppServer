//  for manging the users
const users = [];

const addUser = ({ id, name, room}) => {
    // we need to chnage the name and room the user inters to be consistent
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

        //  this to avoid name duplication
    const exisitingUser = users.find((user) => user.room === room && user.name === name)

    if(exisitingUser) {
        return { error : 'Username is taken'}
    }

    const user = { id, name, room};
    users.push(user);
    return{user};
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return user.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    users.filter((user) => user.room === room)
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom}