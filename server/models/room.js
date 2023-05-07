const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    videoURL: {
        type: String,
        required: true,
    },
    roomName: {
        type: String,
        required: true,
    },
    roomCode: {
        type: String,
        required: true
    }
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;