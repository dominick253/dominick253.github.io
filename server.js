
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const helmet = require('helmet');
const portNum = 3000;
const path = require('path');
const app = express();
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })
const server = require('http').Server(app);
const io = socket(server);

io.on('connection', function (socket) {
  console.log('A user connected');
  socket.emit('connected', { id: socket.id });

  socket.on('disconnect', function () {
    console.log('A user disconnected');
    io.emit('playerDisconnect', { id: socket.id }); // Notify all clients about the disconnection
  });
});

app.use((req, res, next) => {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'",  'maxcdn.bootstrapcdn.com', 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css', "'unsafe-inline'", 'https://use.fontawesome.com'],
        scriptSrc: ["'self'", "'unsafe-eval'", 'cdnjs.cloudflare.com', "'unsafe-inline'", "unpkg.com", 'https://use.fontawesome.com'],
        fontSrc: ["'self'",  'https://fonts.gstatic.com', 'https://use.fontawesome.com', 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'",  'https://i.imgur.com'],
        frameSrc: ["'self'",  'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
        mediaSrc: ["'self'",  'https://s3.amazonaws.com'],
      },
    },
    dnsPrefetchControl: false,
    expectCt: { maxAge: 0 },
    frameguard: { action: 'sameorigin' },
    hidePoweredBy: { setTo: 'PHP 7.4.3' },
    hsts: { maxAge: 0 },
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
  })
);

app.use('/public', express.static(process.cwd() + '/public'));

const rootDir = path.join(__dirname, '/');
app.use(express.static(rootDir));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/index.html');
  });
app.route('/homelab')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/homelab.html');
  });
app.route('/projects')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/projects.html');
  });
app.route('/videos')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/videos.html');
  });
app.route('/files')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/files.html');
  });

const connection = mysql.createConnection({
  host: '10.71.71.221', // *********** Change me to localhost before going to actual server 172.17.0.4****************
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'files',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database!');
  }
});

// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const { originalname, filename } = req.file;
  const { uploaded_by } = req.body;

  // Save file details to the database
  const insertQuery = 'INSERT INTO files (name, uploaded_by, file_path) VALUES (?, ?, ?)';
  connection.query(insertQuery, [originalname, uploaded_by, filename], (err, result) => {
    if (err) {
      console.error('Error inserting file details into the database:', err);
      res.status(500).json({ error: 'Failed to upload file' });
    } else {
      res.json({ message: 'File uploaded successfully' });
    }
  });
});


// Route to handle file download
app.get('/api/files', (req, res) => {
  // Select all files from the database
  const selectQuery = 'SELECT * FROM files';
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving file list from the database:', err);
      res.status(500).json({ error: 'Failed to fetch file list' });
    } else {
      res.json(results);
    }
  });
});


app.get('/download/:fileId', (req, res) => {
  const fileId = req.params.fileId;

  // Retrieve the file details from the database
  const selectQuery = 'SELECT file_path FROM files WHERE id = ?';
  connection.query(selectQuery, [fileId], (err, results) => {
    if (err) {
      console.error('Error retrieving file details from the database:', err);
      res.status(500).json({ error: 'Failed to download file' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'File not found' });
      } else {
        const filePath = path.join(__dirname, 'uploads', results[0].file_path);
        res.download(filePath, (err) => {
          if (err) {
            console.error('Error serving file for download:', err);
            res.status(500).json({ error: 'Failed to download file' });
          }
        });
      }
    }
  });
});

app.delete('/api/files/:fileId', (req, res) => {
  const fileId = req.params.fileId;

  // Retrieve the file details from the database
  const selectQuery = 'SELECT file_path FROM files WHERE id = ?';
  connection.query(selectQuery, [fileId], (err, results) => {
    if (err) {
      console.error('Error retrieving file details from the database:', err);
      res.status(500).json({ error: 'Failed to delete file' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'File not found' });
      } else {
        const filePath = path.join(__dirname, 'uploads', results[0].file_path);

        // Delete the file from the file system
        fs.unlink(filePath, err => {
          if (err) {
            console.error('Error deleting file:', err);
            res.status(500).json({ error: 'Failed to delete file' });
          } else {
            // Delete the file record from the database
            const deleteQuery = 'DELETE FROM files WHERE id = ?';
            connection.query(deleteQuery, [fileId], (err, results) => {
              if (err) {
                console.error('Error deleting file record from the database:', err);
                res.status(500).json({ error: 'Failed to delete file' });
              } else {
                res.json({ message: 'File deleted successfully' });
              }
            });
          }
        });
      }
    }
  });
});

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
