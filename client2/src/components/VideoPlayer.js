import React, { useRef, useEffect } from 'react';
import dashjs from 'dashjs';

const VideoPlayer = ({ url, onReady, onPlay, onPause, onProgress, playerRef, playing}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = dashjs.MediaPlayer().create();
      // playerRef.current.initialize(videoRef.current, url, true);
      playerRef.current.on('ready', onReady);
      playerRef.current.on('play', onPlay);
      playerRef.current.on('pause', onPause);
      playerRef.current.on('timeupdate', onProgress);
    }

    playerRef.current.initialize(videoRef.current, url, playing);


    // if (playing) {
    //   playerRef.current.play();
    // } else {
    //   playerRef.current.pause();
    // }

    return () => {
      playerRef.current.reset();
    };
  }, [url, playerRef, onReady, onPlay, onPause, onProgress, playing]);

  useEffect(() => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [playing]);

  return (
    <div>
      <video ref={videoRef} controls={false} pl/>
    </div>
  );
};

export default VideoPlayer;
