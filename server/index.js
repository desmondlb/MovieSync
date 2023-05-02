const express = require('express');
const app = express();

// Define a route that streams the video from a public S3 bucket
app.get('/video/:key/:startTime', async (req, res) => {
  const { key, startTime } = req.params;

  // Set the range header to start streaming from a specific timestamp
  const rangeHeader = `bytes=${startTime}-`;

  // Stream the video from S3 to the browser
  res.writeHead(206, {
    'Content-Type': 'video/mp4',
    'Content-Range': `bytes ${startTime}-`,
    'Accept-Ranges': 'bytes'
  });
  const s3Stream = request(`https://cs553moviesync.s3.us-east-2.amazonaws.com/${key}.mp4`, {
    headers: { Range: rangeHeader }
  });
  s3Stream.pipe(res);
});

// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
