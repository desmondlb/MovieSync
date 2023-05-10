# Welcome to MovieSync!

A platform to watch movies with your friends! Check out the live project : [http://34.202.237.67:3000/landing](http://34.202.237.67:3000/landing)

## Description

- This platorm supports mp4 files, mpd files (these need to hosted somewhere).
- Plays, pauses, and seeks are synced to all watchers.
- Create separate rooms for for multiple groups.
- We used the following technologies
    - Front End
        - React.js ([React player](https://github.com/cookpete/react-player))
    - Back End 
        - MongoDB (To temporarily store the room codes and usernames in the room)
        - Node.js (Runtime environment)
        - Express.js (Framework for building RESTful APIs with Node.js) 
    - Testing
        - Selenium (mimic the behaviour of mulitple users)
    - Metrics Analysis
        - Python3 (for crunching the numbers)
- Movie files in mp4 format and chucks created for MPEG_DASH Streaming are stored on** AWS S3.**
- We use **AWS CloudFront** to stream them seamlessly across the globe.
- We have hosted the server on **AWS EC2**

## Architecture
 <img src="https://user-images.githubusercontent.com/31558571/236909678-9ca4de20-b725-4c10-8b8f-879acccda889.png" width="50%" height="50%">

## How to run?
### Deploying the software :
1. Depending on if you want to deploy this project locally or on a server like AWS EC2 you must set your ip in the `/client/src/context/socket.js` If you want to deploy on your local machine, change the server_ip to `localhost`. Use the public IP of your server if deploying elsewhere
2. Clone this repository
3. Navigate to individual folders for client, server, analysis_server and run `npm i` to install npm dependencies
4. Go to analytics_server folder and start it using `node index.js` or `npm run start`
5. Go to server folder and start it using `node server.js`or `npm run start`
6. Then navigate to client and then run `npm run start` to start the client

### How to create and join a room ? 
7. Go to 34.202.237.67:3000 or localhost:3000 and create a room by entering any of the links on the homepage in the URL box, your username, and room name. You will see a roomcode generated. 
8. On another tab/device login by using the 2nd form on the landing page, enter the room code along woth your username this time.
9. A video player should load on the second user's screen, now you can play the video using any of the controls.
10. The performance metrics will be sent to the analytics server on PORT 8000 on the same host you deploed the software.  


## How to test? 

* We measure 3 important metrics for out project:
    * **Latency of Video Synchronization **
    * **Buffer rate**
    * **Bitrate**
* Logs from your session will be stored in `/analytics_server/logs.txt`, `/analytics_server/bufferLogs.txt`, `/analytics_server/bitRateLogs.txt` 
* To replicate our tests, use  `orchestrate.py` , you can mention your room code in the script. Generating all empirical evidence will require around 20 minutes per test, depending on the type of test you choose to do. Some of the experiments are given below. 
* You can find the results of out experimentation  in the `Performance Scripts` folder
* We have gathered the metrics for different experiments, where we try to play, pause, and seek to a particular timestmp and see how the software performs in terms of the above metrics. We add more clients to the room as well and check for performance. 
    * Streaming MP4 file from AWS S3 (2 clients, 21 clients)
    * Streaming MP4 file from AWS S3 using CDN (2 clients, 15 clients)
    * Streaming using MPEG-DASH and using CDN (2 clients, 19 clients) [Most important! This is the best case scenario!]
    
 ## Screenshots
<img src="https://user-images.githubusercontent.com/31558571/236912504-7dd73ace-fd18-4019-9181-d4e659a490bc.png" width="50%" height="50%">
<img src="https://user-images.githubusercontent.com/31558571/236912972-86461578-60f1-43ac-936c-0646f499b4ae.png" width="50%" height="50%">



