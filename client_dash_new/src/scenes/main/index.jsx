import React, { useState }  from 'react';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom';



const Landing = () => {
  const [link, setLink] = useState("");
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setLink(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
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
            userName: userName,
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
        userName: userName,
        roomCode: roomCode
    };

    // Navigate to VideoPlayer component with the required data
    navigate('/room', { state: data });
  };

  return (
    <div>
  <input style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={link} onChange={handleInputChange} placeholder="Enter URL"/>
  <br/>
  <input style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={userName} onChange={handleUserNameChange} placeholder="Enter username" />
  <br/>
  <input style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={roomName} onChange={handleRoomNameChange} placeholder="Enter room name" />
  <br/>
  <button style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px", border: "none"}} onClick={handleCreateRoomClick}>Create Room</button>
  <br/><br/><br/><br/><br/><br/><br/>
  <input style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={userName} onChange={handleUserNameChange} placeholder="Enter username" />
  <br/>
  <input style={{border: "1px solid #ccc", padding: "10px"}} type="text" value={roomCode} onChange={handleRoomCodeChange} placeholder="Enter room code" />
  <br/>
  <button style={{backgroundColor: "#4CAF50", color: "#fff", padding: "10px", border: "none"}} onClick={handleJoinRoomClick}>Join Room</button>
</div>

  )
};

export default Landing;
