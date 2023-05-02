
//https://cs553moviesync.s3.us-east-2.amazonaws.com/Jethalal_Plays_Football_720p.mp4
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoId }) => {
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);

  const handlePlay = (startTime) => {
    // Check if the player is ready before calling the play method
    if (isReady) {
      playerRef.current.seekTo(startTime);
      // playerRef.current.play();
    }
  };

  const handleReady = () => {
    // Set isReady to true when the player is ready
    setIsReady(true);
  };

  return (
    <div>
      <ReactPlayer
        url={`https://cs553moviesync.s3.us-east-2.amazonaws.com/${videoId}.mp4`}
        controls={true}
        ref={playerRef}
        onReady={handleReady}
      />
      <div>
        <button onClick={() => handlePlay(10)}>Play from 10 seconds</button>
        <button onClick={() => handlePlay(30)}>Play from 30 seconds</button>
        <button onClick={() => handlePlay(60)}>Play from 60 seconds</button>
      </div>
    </div>
  );
};

export default VideoPlayer;

