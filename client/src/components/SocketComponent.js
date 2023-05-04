import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {io} from 'socket.io-client';
// import VideoPlayer from '../../components/VideoPlayer';
import ReactPlayer from 'react-player';

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const SocketComponent = () => {
    const [roomCode, setRoomCode] = useState("");
    const [peopleInParty, setPeopleInParty] = useState(0);
    const [userName, setUserName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [pausedAt, setPausedAt] = useState(null);
    const playerRef = useRef(null);
    let allowEmit = true;
    const socket = io('http://localhost:5000', {
        autoConnect: true
      }); // replace with your server URL
    
    
    const location = useLocation();

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
        console.log('Socket connected');
        });
        socket.on('user-joined', (data) => {
            if(data.roomCode == roomCode){
                console.log("User joineddddd");
                setPeopleInParty(data.members);
            }
        });
        socket.on('left', (data) => {
            setPeopleInParty(data.members);
        });
        socket.on('playerControlUpdate', (data) => {
            console.log("Got message from server");
            if(data.message == "play") {
                // console.log(data)
                // videoPlayer.currentTime = data.context
                // allowEmit = false;
                // videoPlayer.play()

                // Check if the player is ready before calling the play method
                console.log("HandlePlay start time: ",data.context)
                if (isReady) {
                    let resumeTime;
                    if (!isPlaying && isFinite(data.context)) {
                        resumeTime = data.context;
                    }
                    else {
                        // if the player is paused
                        resumeTime = pausedAt !== null ? pausedAt : data.context;
                    }
                    playerRef.current.seekTo(resumeTime);
                    console.log("Video playing from last paused stamp:",pausedAt);
                    setPausedAt(null);
                    allowEmit = false;
                }
                console.log(playerRef.current);
            }
            if(data.message == "pause") {
                // console.log(data)
                // videoPlayer.currentTime = data.context
                // allowEmit = false;
                // videoPlayer.pause()
                const pausedAt = data.context;
                console.log(`Video paused at ${pausedAt}`);
                setPausedAt(pausedAt);
                playerRef.current.seekTo(pausedAt);
                setIsPlaying(false);
                allowEmit = false;
            }
        });
        socket.on('left', (data) => {
            setPeopleInParty(data.members);
        });
        // return () => {
        // socket.disconnect();
        // };
        setUserName(location.state.userName);
        
        if(!("roomCode" in location.state)){ 
            // Indicates create a new room
            setRoomCode();
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "roomName": location.state.roomName,
                "roomCode": randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/room/create", requestOptions)
            .then( async (result) => {
                const resp = await result.json()
                if(resp.message == "success") {
                    socket.emit('new-user-joined', { userName: location.state.userName, roomCode: resp.roomCode });
                    setRoomCode(resp.roomCode);
                    setRoomName(resp.roomName);
                    setUserName(location.state.userName);

                }
            })
            .catch(error => console.log('error', error));


        } else {
            // Indicates join a room
            

            // Find the room name
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "roomCode": location.state.roomCode
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/room/join", requestOptions)
            .then( async (result) => {
                const resp = await result.json()
                if(resp.message != "success") {
                    document.getElementById("joinRoomText").innerHTML = resp.message
                } else {
                    socket.emit('new-user-joined', { name: location.state.userName, roomCode: resp.roomCode })
                    setRoomCode(resp.roomCode);
                    setRoomName(resp.roomName);
                }   
            })
            .catch(error => console.log('error', error));
        }
    }, []);


    // useEffect(() => {
        

    // }, []);


    const handlePlay = () => {
        // Check if the player is ready before calling the play method
        let startTime = playerRef.current.getCurrentTime();
        // console.log("HandlePlay start time: ",startTime)
        if (isReady) {
          let resumeTime;
          if (!isPlaying && isFinite(startTime)) {
            resumeTime = startTime;
          }
          else // if the player is paused
          {
            resumeTime = pausedAt !== null ? pausedAt : startTime;
          }
          playerRef.current.seekTo(resumeTime);
        //   console.log("Video playing from last paused stamp:",pausedAt);
          setPausedAt(null);
        }
        console.log(playerRef.current);

        if(allowEmit == true){
            console.log("Trying to send the message to server")
            console.log(socket);
            socket.emit("playerControl", {message: "play", context: startTime, roomCode: roomCode}) 
        } 
        setTimeout(() => {
            allowEmit = true
        }, 500);

      };
    
      const handleReady = () => {
        // Set isReady to true when the player is ready
        // console.log('Player is ready');
        setIsReady(true);
      };
    
      const handlePause = (e) => {
        // Capture the pause time of the video
        const pausedAt = playerRef.current.getCurrentTime();
        setPausedAt(pausedAt);
        setIsPlaying(false);

        if(allowEmit == true){
            console.log(`Video paused at ${pausedAt}`);    
            socket.emit("playerControl", {message: "pause", context: pausedAt, roomCode: roomCode})
        }
        setTimeout(() => {
            allowEmit = true
        }, 500);
        // TODO: Do something with the pause time, e.g. send it to a server
      };


    return (
        <div>
        <ReactPlayer
          url={`https://cs553moviesync.s3.us-east-2.amazonaws.com/Jethalal_Plays_Football_720p.mp4`}
          controls={true}
          ref={playerRef}
          playing={false}
          onReady={handleReady}
          onPause={handlePause}
          onPlay={handlePlay}
        />
        <p>{roomCode}</p>
        
      </div>
    );
};

export default SocketComponent;
