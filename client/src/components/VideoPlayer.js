import React, { useState, useRef, useEffect } from 'react';

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastPlayPauseTime, setLastPlayPauseTime] = useState(null);
  const textTrackRef = useRef(null);

  function handlePlayPause() {
    setIsPlaying(!isPlaying);
    setLastPlayPauseTime(Date.now());
  }

  const videoUrl = 'https://cs553moviesync.s3.us-east-2.amazonaws.com/Jethalal_Plays_Football_720p.mp4';

  useEffect(() => {
    if (textTrackRef.current) {
      const textTrack = textTrackRef.current.track;
      textTrack.mode = 'showing';
      const cue = new VTTCue(0, 0, '');
      textTrack.addCue(cue);
      textTrack.addEventListener('cuechange', handleCueChange);
    }
  }, []);

  function handleCueChange() {
    const cue = textTrackRef.current.track.activeCues[0];
    if (cue) {
      const timestamp = cue.text;
      console.log(`User clicked play/pause at ${timestamp}`);
    }
  }

  return (
    <div>
      <video src={videoUrl} controls={true} autoPlay={isPlaying}>
        <track
          ref={textTrackRef}
          kind="metadata"
          srcLang="en"
          label="Timestamps"
        />
      </video>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
}

export default VideoPlayer;
