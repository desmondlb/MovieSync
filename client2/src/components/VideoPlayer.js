//https://cs553moviesync.s3.us-east-2.amazonaws.com/Jethalal_Plays_Football_720p.mp4
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoId }) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausedAt, setPausedAt] = useState(null);
  const playerRef = useRef(null);

  const handlePlay = (startTime) => {
    // Check if the player is ready before calling the play method
    console.log("HandlePlay start time: ",startTime)
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
      console.log("Video playing from last paused stamp:",pausedAt);
      setPausedAt(null);
    }
    console.log(playerRef.current);
      
      /*METRICS MONITORING */
      // playerRef.current.getInternalPlayer().addEventListener('loadedmetadata', () => {
      //   console.log('Loaded metadata');
      //   const videoElement = playerRef.current.getInternalPlayer();
      //   console.log('Latency:', videoElement.currentTime - startTime);
      //   setInterval(() => {
      //     console.log('Frame drop:', videoElement.webkitDecodedFrameCount - videoElement.webkitDroppedFrameCount);
      //     console.log('Bitrate:', videoElement.videoBitsPerSecond);
      //   }, 1000);
      // });
  };

  const handleReady = () => {
    // Set isReady to true when the player is ready
    console.log('Player is ready');
    setIsReady(true);
  };

  const handlePause = () => {
    // Capture the pause time of the video
    const pausedAt = playerRef.current.getCurrentTime();
    console.log(`Video paused at ${pausedAt}`);
    setPausedAt(pausedAt);
    setIsPlaying(false);
    // TODO: Do something with the pause time, e.g. send it to a server
  };
  return (
    <div>
      <ReactPlayer
        url={`https://cs553moviesync.s3.us-east-2.amazonaws.com/${videoId}.mp4`}
        controls={true}
        ref={playerRef}
        playing={true}
        onReady={handleReady}
        onPause={handlePause}
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

