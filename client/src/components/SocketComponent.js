import React, { useRef, useContext, useState, useEffect } from 'react';
import { SocketContext, server_ip} from '../context/socket';
import { useLocation, useNavigate} from 'react-router-dom';
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
    const navigate = useNavigate();
    const [bufferStartTime, setBufferStartTime] = useState(0);
    const [buffering, setBuffering] = useState(false);
    const [bufferRate, setBufferRate] = useState(0);
    const [videoURL, setVideoURL] = useState("");
    const [bitrate, setBitrate] = useState(0);
    
    // const server_ip = "34.202.237.67";

    const playerRef = useRef(null);
    let allowEmit = true;
    const socket = useContext(SocketContext);
    // const server_ip = useContext(SocketContext);
    // const socket = io('http://34.202.237.67:5000', {
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
            // console.log("Got message from server",data);

            if(data.message == "play") {

                // Check if the player is ready before calling the play method
                    let resumeTime=0;
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

                // console.log(playerRef.current);
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
        socket.on('deleteRoomUpdate', (data) => {
            setIsPlaying(false);
            setRoomCode("");
            setPeopleInParty(0);
            navigate(-1);
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
                "videoURL": location.state.link,
                "roomName": location.state.roomName,
                "roomCode": randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://"+server_ip+":5000/room/create", requestOptions)
            .then( async (result) => {
                const resp = await result.json()
                if(resp.message == "success") {
                    socket.emit('new-user-joined', { userName: location.state.userName, roomCode: resp.roomCode });
                    console.log(resp);
                    setRoomCode(resp.roomCode);
                    setRoomName(resp.roomName);
                    setVideoURL(resp.videoURL);
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

            fetch("http://"+server_ip+":5000/room/join", requestOptions)
            .then( async (result) => {
                const resp = await result.json()
                if(resp.message != "success") {
                    document.getElementById("joinRoomText").innerHTML = resp.message
                } else {
                    socket.emit('new-user-joined', { name: location.state.userName, roomCode: resp.roomCode })
                    setRoomCode(resp.roomCode);
                    setRoomName(resp.roomName);
                    setVideoURL(resp.videoURL);
                }   
            })
            .catch(error => console.log('error', error));
        }
    }, []);


    // useEffect(() => {
        

    // }, []);

    const saveBitRateLog = async () => {
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
    
      try {
        const response = await fetch("http://" + server_ip + ":8000/bitRateLog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomCode: roomCode,
            userName: userName,
            bitRate: bitrate,
            timeStamp: new Date(utcTimestamp).toISOString(),
          }),
        });
        if (response.status === 200) {
          // Success: log data saved successfully
          console.log("BitRate Log data saved successfully");
        } else if (response.status === 500) {
          // Server error: error writing to log file
          console.error("Error writing to BitRate log file");
        } else {
          // Other error: network response was not ok
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };


    const saveBufferLog = async () => {
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
      
        try {
          const response = await fetch("http://" + server_ip + ":8000/bufferLog", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomCode: roomCode,
              userName: userName,
              bufferRate: bufferRate,
              timeStamp: new Date(utcTimestamp).toISOString(),
            }),
          });
          if (response.status === 200) {
            // Success: log data saved successfully
            console.log("Buffer Log data saved successfully");
          } else if (response.status === 500) {
            // Server error: error writing to log file
            console.error("Error writing to Buffer log file");
          } else {
            // Other error: network response was not ok
            throw new Error("Network response was not ok");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      

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

        fetch("http://"+server_ip+":8000/log", {
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
        // console.log("Im in handleplay")
        if (isReady) {
          let resumeTime=0;
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
        // console.log(playerRef.current);
        setIsPlaying(true);
        if(allowEmit == true){
            // console.log(socket);
            socket.emit("playerControl", {message: "play", context: startTime, roomCode: roomCode});
            saveLogData("play");
        } 
        setTimeout(() => {
            allowEmit = true
        }, 500);
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


    
    const handleProgress = ({ loaded,playedSeconds }) => { //TODO: calculate the frame drop rate for each user metrics should look like (U1: droprate1,U2:droprate2, ....) - 
        const currentFrameTime = playedSeconds * 1000;
        if (lastFrameTime !== null) {
            //console.log("currentFrameTime :",currentFrameTime,"lastFrameTime :",lastFrameTime)
            const timeDiff = currentFrameTime - lastFrameTime;
            const expectedFrameTime = 1000 / 60; // the video is 30 fps 30 fps
            const frameDropRate = timeDiff / expectedFrameTime - 1;
            setFrameDropRate(frameDropRate);
            //console.log("frameDropRate",frameDropRate)
        }
        setLastFrameTime(currentFrameTime);
        const currentDataSize = Math.round(loaded * playerRef.current.getDuration() * 1000);
        const prevDataSize = Math.round(loaded * (playerRef.current.getCurrentTime() - 1) * 1000);
        const dataSizeDuringInterval = currentDataSize - prevDataSize;
        const currentBitrate = Math.round(dataSizeDuringInterval / 1000);

        setBitrate(currentBitrate);
        saveBitRateLog();
        saveBufferLog();

    };

    const handleClick = async () => {
          const response = await fetch("http://"+server_ip+":5000/room/close-room", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomCode: roomCode })
          }).then(response => {
            if (response.status === 200) {
              // Success: room deleted
              console.log('Room deleted');
              socket.emit("deleteRoom", {message: "delete", roomCode: roomCode});
              navigate(-1);
            } else {
              // Other error: network response was not ok
              throw new Error('Network response was not ok');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          })
      };

    //   url={`https://cs553moviesync.s3.us-east-2.amazonaws.com/manifest.mpd`}
        // ...
    return (
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center', padding: '20px', backgroundColor: '#f7f7f7',borderRadius: '10px',}}>
            <ReactPlayer
            url={videoURL}
            controls={true}
            ref={playerRef}
            playing={isPlaying}
            muted={true}
            onReady={handleReady}
            onPause={handlePause}
            onPlay={handlePlay}
            onProgress={handleProgress}
            onError={(e) => console.log('Error:', e)}

            onBuffer={() => {
                setPausedAt(playerRef.current.getCurrentTime());
                //setIsPlaying(false);
                setBuffering(true);
                setBufferStartTime(Date.now());
            }}
            onBufferEnd={() => {
                const bufferEndTime = Date.now();
                const bufferTime = bufferEndTime - bufferStartTime;
                const bufferedSeconds = bufferTime / 1000;
                const bufferRate = bufferedSeconds / (playerRef.current.getDuration() - playerRef.current.getCurrentTime());
                setBuffering(false);
                setBufferRate(bufferRate);
                //console.log("bufferRate: ", bufferRate);
                //saveBufferLog();
                setBufferStartTime(null);
            }}
            />
        
            <p style={{marginTop: '20px',padding: '10px',border: '1px solid black',borderRadius: '5px',fontWeight: 'bold',color: '#333'}} >
              This is your room code: {roomCode}</p>
            <button style={{marginTop: '20px',backgroundColor: '#4CAF50',color: 'white',padding: '10px 20px',borderRadius: '5px',border: 'none',cursor: 'pointer'}}onClick={handleClick}>
            {'Close Group'}
            </button>
        
        </div>
      
    );
};

export default SocketComponent;
