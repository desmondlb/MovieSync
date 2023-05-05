import React, { useEffect } from 'react';
import dashjs from 'dashjs';

function DashPlayer() {
  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    player.initialize(document.querySelector("#video"), "https://cs553moviesync.s3.us-east-2.amazonaws.com/bbb_30fps.mpd", true);

    player.on(dashjs.MediaPlayer.events.ERROR, function (e) {
      console.error('Error encountered:', e);
    });
    // player.setLogLevel(dashjs.Debug.LOG_LEVEL_INFO);

    return () => {
      player.reset();
    }
  }, []);

  return (
    <div>
      <video id="video" controls></video>
    </div>
  );
}

export default DashPlayer;
