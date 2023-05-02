import React, { useState }  from 'react'
import VideoPlayer from '../../components/VideoPlayer';

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
    // <div>
    //   <input type="text" value={link} onChange={handleInputChange} />
    //   <button onClick={handleCreateRoomClick}>Create Room</button>
    //   <button onClick={handleJoinRoomClick}>Join Room</button>
    // </div>
    <div>
      <h1>My Video Player</h1>
      <VideoPlayer videoId="Jethalal_Plays_Football_720p" />
    </div>
  )
};
export default Landing;