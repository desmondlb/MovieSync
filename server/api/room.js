const router = require('express').Router();

var global = {};

router.post('/create', (req, res) => {
    const { roomName, roomCode, videoSize } = req.body

    global[roomCode] = {"roomName":roomName, "videoSize": videoSize}

    res.send({message: "success"})
});

router.post('/join', (req, res) => {
    const { roomCode, videoSize } = req.body
    if(roomCode in global){
        if(global[roomCode].videoSize != videoSize) {
            res.send(
                {
                    message: "video is different than the host's video."
                }
            )
        } else {
            res.send(
                {
                    roomCode,
                    videoSize,
                    roomName: global[roomCode].roomName,
                    message: "success"
                }
            )
        }
    } else {
        res.send(
            {
                message: "room code invalid"
            }
        )
    }
})

module.exports = router;