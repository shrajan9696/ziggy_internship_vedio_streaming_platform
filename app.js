const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Define storage for uploaded videos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'videos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

// Route to handle video upload
app.post('/upload', upload.single('video'), (req, res) => {
  res.send('Video uploaded successfully!');
});

// Route to stream video
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
})
app.get('/stream/:videoName', (req, res) => {
  const videoPath = `videos/${req.params.videoName}`;

  // Check if video exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found!');
  }

  // Create video read stream and pipe it to response
  const videoStream = fs.createReadStream(videoPath);
  videoStream.pipe(res);
});

// Route to download video
app.get('/download/:videoName', (req, res) => {
  const videoPath = `videos/${req.params.videoName}`;

  // Check if video exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found!');
  }

  res.download(videoPath);
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000!');
});
