import React, { useRef, useContext, useState, useEffect } from 'react';
import { SocketContext } from '../context/socket';
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
    const [lastFrameTime, setLastFrameTime] = useState(null);
    const [frameDropRate, setFrameDropRate] = useState(null);
    const [latency, setLatency] = useState(null); //TODO

    

    
    const playerRef = useRef(null);
    let allowEmit = true;
    const socket = useContext(SocketContext);
    // const socket = io('http://localhost:5000', {
    //     autoConnect: true
    //   }); // replace with your server URL
    
    
    const location = useLocation();

    useEffect(() => {
        // socket.connect();
        // socket.on('connect', () => {
        // console.log('Socket connected');
        // });
        socket.on('user-joined', (data) => {
            if(data.roomCode == roomCode){
                setPeopleInParty(data.members);
            }
        });
        socket.on('left', (data) => {
            setPeopleInParty(data.members);
        });
        socket.on('playerControlUpdate', (data) => {
            console.log("Got message from server");
            if(data.message == "play") {

                // Check if the player is ready before calling the play method
                    let resumeTime;
                    if (!isPlaying && isFinite(data.context)) {
                        resumeTime = data.context;
                    }
                    else {
                        // if the player is paused
                        resumeTime = pausedAt !== null ? pausedAt : data.context;
                    }
                    playerRef.current.seekTo(resumeTime);
                    setPausedAt(null);
                    allowEmit = false;
                    setIsPlaying(true);
                    setLastFrameTime(playerRef.current.getCurrentTime() * 1000);

                console.log(playerRef.current);
            }
            if(data.message == "pause") {
                const pausedAt = data.context;
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

            fetch("http://3.91.52.183:5000/room/create", requestOptions)
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

            fetch("http://3.91.52.183:5000/room/join", requestOptions)
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
    const saveLogData = (action) => {
        const now = new Date();
        const utcTimestamp = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
        );

        fetch('http://localhost:3002/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            roomCode: roomCode,
            userName: userName,
            action: action,
            timeStamp: new Date(utcTimestamp).toISOString()
          })
        })
        .then(response => {
            if (response.status === 200) {
              // Success: log data saved successfully
              console.log('Log data saved successfully');
            } else if (response.status === 500) {
              // Server error: error writing to log file
              console.error('Error writing to log file');
            } else {
              // Other error: network response was not ok
              throw new Error('Network response was not ok');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      

    const handlePlay = () => {
        // Check if the player is ready before calling the play method
        let startTime = playerRef.current.getCurrentTime();
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
          setPausedAt(null);
        }
        console.log(playerRef.current);
        setIsPlaying(true);
        if(allowEmit == true){
            console.log(socket);
            socket.emit("playerControl", {message: "play", context: startTime, roomCode: roomCode});
            saveLogData("play");
        } 
        setTimeout(() => {
            allowEmit = true
        }, 500);
              /*METRICS MONITORING */
        playerRef.current.getInternalPlayer().addEventListener('loadedmetadata', () => {
            console.log('Loaded metadata');
            const videoElement = playerRef.current.getInternalPlayer();
            console.log('Latency:', videoElement.currentTime - startTime);
            setInterval(() => {
            console.log('Frame drop:', videoElement.webkitDecodedFrameCount - videoElement.webkitDroppedFrameCount);
            console.log('Bitrate:', videoElement.videoBitsPerSecond);
            }, 1000);
        });
      };
    
    const handleReady = () => {
    // Set isReady to true when the player is ready
        setIsReady(true);
    };
    
    const handlePause = (e) => {
    // Capture the pause time of the video
        const pausedAt = playerRef.current.getCurrentTime();
        setPausedAt(pausedAt);
        setIsPlaying(false);

        if(allowEmit == true){
            console.log(`Video paused at ${pausedAt}`);    
            socket.emit("playerControl", {message: "pause", context: pausedAt, roomCode: roomCode});
            saveLogData("pause");
        }
        setTimeout(() => {
            allowEmit = true
        }, 500);
    };

    
    const handleProgress = ({ playedSeconds }) => { //TODO: calculate the frame drop rate for each user metrics should look like (U1: droprate1,U2:droprate2, ....) - 
        const currentFrameTime = playedSeconds * 1000;
        if (lastFrameTime !== null) {
            console.log("currentFrameTime :",currentFrameTime,"lastFrameTime :",lastFrameTime)
            const timeDiff = currentFrameTime - lastFrameTime;
            const expectedFrameTime = 1000 / 60; // the video is 30 fps 30 fps
            const frameDropRate = timeDiff / expectedFrameTime - 1;
            setFrameDropRate(frameDropRate);
            console.log("frameDropRate",frameDropRate)
        }
        setLastFrameTime(currentFrameTime);
    };

        
        // ...
    return (
        <div>
            <ReactPlayer
            url={`https://dash.akamaized.net/dash264/TestCasesIOP33/adapatationSetSwitching/5/manifest.mpd`}
            controls={true}
            ref={playerRef}
            playing={isPlaying}
            muted={true}
            onReady={handleReady}
            onPause={handlePause}
            onPlay={handlePlay}
            onProgress={handleProgress}
            />
            <p>{roomCode}</p>
        
      </div>
    );
};

export default SocketComponent;
