# Welcome to MovieSync!

A platform to watch movies with your friends!

## Description

- This platorm supports mp4 files, mpd files (these need to hosted somewhere).
- Plays, pauses, and seeks are synced to all watchers.
- Create separate rooms for for multiple groups.
- We used the following technologies
  - Front End
    - React.js
  - Back End
    - MongoDB
    - Node.js
    - Express.js
  - Metrics Analysis
    - Python3

## How to run?

- Clone this repository
- Navigate to individual folders for client, server, analysis_server and run `npm i` to install npm dependencies
- start analysis_server using `node index.js`
- start server using `node server.js`
- before starting client first we have to make a small change in the ip address that points to the servers.
- navigate to c`lient/src/context/socket.js` and change the server_ip to `localhost` or wherever you have hosted the server
- Then navigate to client and then run `npm start` to start the client
- You can choose whichever link you want as the url and create a room and then open another instance of the client in the browser and join the room using the room code that is displayed on the screen of the videoplayer.
