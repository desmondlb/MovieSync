const router = require('express').Router();
const Room = require('../models/Room')

var global = {};

// router.post('/create', (req, res) => {
//     const { roomName, roomCode} = req.body

//     global[roomCode] = {"roomName":roomName}

//     res.send({message: "success", roomName: roomName, roomCode: roomCode})
// });

router.post('/create', (req, res) => {
    const { videoURL, roomName, roomCode } = req.body
    let newRoom = Room({
        videoURL,
        roomName,
        roomCode
    })
    newRoom.save()
    res.send({message: "success", roomName: roomName, roomCode: roomCode, videoURL: videoURL})
});

// Define a route for clearing the MongoDB collection
router.post('/close-room', async (req, res) => {
    try {
        const { roomCode } = req.body
        const deletedRoom = await Room.findOneAndDelete({ roomCode });
        if (!deletedRoom) {
          // If no matching document is found, send a 404 response
          res.status(404).json({ error: 'Room not found' });
          return;
        }
        // Send a success response
        res.status(200).json({ message: 'Room deleted successfully' });
      } catch (err) {
        // Send an error response
        console.error('Error deleting room:', err);
        res.status(500).json({ error: err.message });
      }
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
                    videoURL: room.videoURL,
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