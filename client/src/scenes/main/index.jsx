import React, { useState }  from 'react';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom';



const Landing = () => {
  const [link, setLink] = useState("");
  const [userNameJoin, setUserNameJoin] = useState("");
  const [userNameCreate, setUserNameCreate] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setLink(event.target.value);
  };

  const handleUserNameChangeJoin = (event) => {
    setUserNameJoin(event.target.value);
  };

  const handleUserNameChangeRoomCreator = (event) => {
    setUserNameCreate(event.target.value);
  };

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

    const handleCreateRoomClick = () => {
        // Collect the user inputs
        const data = {
            link: link,
            userName: userNameCreate,
            roomName: roomName
        };


        // console.log(data);

        // Navigate to VideoPlayer component with the required data
        navigate('/room', { state: data });
  };

  const handleJoinRoomClick = () => {
    // handle join room click here
    // Collect the user inputs
    const data = {
        userName: userNameJoin,
        roomCode: roomCode
    };

    // Navigate to VideoPlayer component with the required data
    navigate('/room', { state: data });
  };

  return (
    
    <div>
  <header style={{backgroundColor: "#333", color: "#fff", padding: "20px", textAlign: "center" , marginBottom: "20px" }}>  
    <h1>Welcome to Movie Sync</h1>
	</header>
  <p>Create a room!</p>
  <input style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={link} onChange={handleInputChange} placeholder="Enter URL"/>
  <br/>
  <input style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={userNameCreate} onChange={handleUserNameChangeRoomCreator} placeholder="Enter username" />
  <br/>
  <input  style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={roomName} onChange={handleRoomNameChange} placeholder="Enter room name" />
  <br/>
  <button style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px", border: "none"}} onClick={handleCreateRoomClick}>Create Room</button>
  <br/><br/><br/>
  <p>Join a room!</p><br/>
  <input id="username_join" style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={userNameJoin} onChange={handleUserNameChangeJoin} placeholder="Enter username" />
  <br/>
  <input id="roomname" style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={roomCode} onChange={handleRoomCodeChange} placeholder="Enter room code" />
  <br/>
  <button style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px", border: "none"}} onClick={handleJoinRoomClick}>Join Room</button>

  <div style={{position: 'absolute',  bottom: 0,  left: '00%',  textAlign: 'left',  width: '1000px'}}>
    <p>Some pre saved links to copy: <br/> 
    https://dws5t5eawmivf.cloudfront.net/Tears+of+Steel+-+Blender+VFX+Open+Movie(720p).mp4 <br/>
    https://dws5t5eawmivf.cloudfront.net/manifest.mpd<br/>
    https://cs553moviesync.s3.us-east-2.amazonaws.com/Tears+of+Steel+-+Blender+VFX+Open+Movie(720p).mp4 <br/>
    https://cs553moviesync.s3.us-east-2.amazonaws.com/manifest.mpd</p></div>
</div>

  )
};

export default Landing;
