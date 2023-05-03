const express = require('express');
const cors = require("cors");
const socketIO = require("socket.io")

const app = express();
const port = 5000;

// Define a route that streams the video from a public S3 bucket
app.get('/video/:key/:startTime', async (req, res) => {
  const { key, startTime } = req.params;

  // Set the range header to start streaming from a specific timestamp
  const rangeHeader = `bytes=${startTime}-`;

  // Stream the video from S3 to the browser
  res.writeHead(206, {
    'Content-Type': 'video/mp4',
    'Content-Range': `bytes ${startTime}-`,
    'Accept-Ranges': 'bytes'
  });
  const s3Stream = request(`https://cs553moviesync.s3.us-east-2.amazonaws.com/${key}.mp4`, {
    headers: { Range: rangeHeader }
  });
  s3Stream.pipe(res);
});


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

app.use('/room', require('./routes/room'))

const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined', data => {
        users[socket.id] = {name: data.name, roomCode: data.roomCode}; 
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
        socket.to(data.roomCode).emit('playerControlUpdate', {message: data.message, context: data.context, username: users[socket.id].name})
    })
})
