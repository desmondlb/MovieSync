const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const socketIO = require("socket.io");
const path = require('path');

const app = express();
const port = 5000;


const server = app.listen(port, err => {
    console.log(`API listening on port ${port}.`);
    if (err) throw err;
});

const io = socketIO(server, { cors: true, origins: '*:*' });

app.set('view engine', 'ejs');
app.use('/public', express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connect("mongodb+srv://test:test@cluster0.k9hwucp.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected.")
    });

// Route for blank HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use('/room', require('./api/room'))

const users = {};

io.on('connection', socket=>{
    // console.log(socket.id);
    socket.on('new-user-joined', data => {
        users[socket.id] = {name: data.userName, roomCode: data.roomCode}; 
        // console.log(socket.id);
        socket.join(data.roomCode);
        let newUsers = {}
        for (const [key, value] of Object.entries(users)) {
            if(value.roomCode == data.roomCode) {
                newUsers[key] = users[key]
            }
        }
        socket.broadcast.emit('user-joined', {roomCode: data.roomCode, members: Object.keys(newUsers).length})
    })

    socket.on('disconnectUser', name => {
        let newUsers = {}
        for (const [key, value] of Object.entries(users)) {
            if(value.roomCode == users[socket.id].roomCode) {
                newUsers[key] = users[key]
            }
        }
        socket.to(users[socket.id].roomCode).emit('left', {name: users[socket.id].name, members: Object.keys(newUsers).length -1})
        delete users[socket.id]
        socket.disconnect(true);
    })

    socket.on('playerControl', data => {
        // console.log(socket.id);
        socket.to(data.roomCode).emit('playerControlUpdate', {message: data.message, context: data.context})
    })
})
