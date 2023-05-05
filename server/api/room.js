const router = require('express').Router();
const Room = require('../models/Room')

var global = {};

// router.post('/create', (req, res) => {
//     const { roomName, roomCode} = req.body

//     global[roomCode] = {"roomName":roomName}

//     res.send({message: "success", roomName: roomName, roomCode: roomCode})
// });

router.post('/create', (req, res) => {
    const { roomName, roomCode } = req.body
    let newRoom = Room({
        roomName,
        roomCode
    })
    newRoom.save()
    res.send({message: "success"})
});

router.post('/join', (req, res) => {
    const { roomCode } = req.body;
    Room.findOne({roomCode}).then(room => {
        if(!room) {
            res.send(
                {
                    message: "room code invalid"
                }
            )
        } else {
    // if(roomCode in global){
        // if(global[roomCode].videoSize != videoSize) {
        //     res.send(
        //         {
        //             message: "video is different than the host's video."
        //         }
        //     )
        // } else {
            res.send(
                {
                    roomCode,
                    roomName: room.roomName,
                    message: "success"
                }
            )
        }})
        // }
    // } else {
    //     res.send(
    //         {
    //             message: "room code invalid"
    //         }
    //     )
    // }
})

module.exports = router;