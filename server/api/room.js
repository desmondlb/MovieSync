const router = require('express').Router();

var global = {};

router.post('/create', (req, res) => {
    const { roomName, roomCode} = req.body

    global[roomCode] = {"roomName":roomName}

    res.send({message: "success", roomName: roomName, roomCode: roomCode})
});

router.post('/join', (req, res) => {
    const { roomCode } = req.body;
    if(roomCode in global){
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
                    roomName: global[roomCode].roomName,
                    message: "success"
                }
            )
        // }
    } else {
        res.send(
            {
                message: "room code invalid"
            }
        )
    }
})

module.exports = router;