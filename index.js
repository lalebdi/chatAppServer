const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);
// to register clients entering and leaving is below:
io.on('connect', (socket) => {
    // console.log('We have a new connection!!!');

    socket.on('join', ({ name, room }, callback) => {
        // console.log(name, room);
        // the call back is for error handling
        const { error, user } = addUser({ id: socket.id, name, room });
        
        if(error) return callback(error); // the error message is coming from the functions in the users.js

        socket.join(user.room);
        
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`}); //this is for admin messaging

        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` }); // this is for sending a message to everyone beside the specific user. 

        

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        
        callback();
    }); // here we want to expect the event from the backend

    socket.on('disconnect', () => {
        // console.log('User had left!!')
        const user = removeUser(socket.id);
        // to let the users know that someone left
        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});



server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));