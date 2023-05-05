const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/getLog_latency', (req, res) => {
  // TODO: read the log file and return the data
});

app.post('/log', (req, res) => {
  const { roomCode, userName, action, timeStamp } = req.body;
  const logData = `${timeStamp} | ${roomCode} | ${userName} | ${action}\n`;

  fs.appendFile('log.txt', logData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error writing to log file');
    } else {
      res.status(200).send('Log data saved successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
