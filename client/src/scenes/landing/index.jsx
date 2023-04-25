import React, { useState }  from 'react'

const Landing = () => {
  const [link, setLink] = useState("");

  const handleInputChange = (event) => {
    setLink(event.target.value);
  };

  const handleCreateRoomClick = () => {
    // handle create room click here
  };

  const handleJoinRoomClick = () => {
    // handle join room click here
  };
  return (
    <div>
      <input type="text" value={link} onChange={handleInputChange} />
      <button onClick={handleCreateRoomClick}>Create Room</button>
      <button onClick={handleJoinRoomClick}>Join Room</button>
    </div>
  )
};
export default Landing;