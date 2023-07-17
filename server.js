const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const helmet = require('helmet');
const portNum = 3000;
const path = require('path');
const app = express();

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

  //will enable security later once I get everything in place so I can add permissions
// app.use((req, res, next) => {
//   res.setHeader('Surrogate-Control', 'no-store');
//   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '0');
//   next();
// });

// app.use(
//     helmet({
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'"],
//           styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com', 'https://fonts.googleapis.com', "'unsafe-inline'"],
//           scriptSrc: ["'self'", 'cdnjs.cloudflare.com', "'unsafe-inline'"],
//           fontSrc: ["'self'", 'https://fonts.gstatic.com'],
//           imgSrc: ["'self'", 'https://i.imgur.com'],  // Add this line
//           frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],  // Add this line
//         },
//       },
//       dnsPrefetchControl: false,
//       expectCt: { maxAge: 0 },
//       frameguard: { action: 'sameorigin' },
//       hidePoweredBy: { setTo: 'PHP 7.4.3' },
//       hsts: { maxAge: 0 },
//       ieNoOpen: true,
//       noSniff: true,
//       permittedCrossDomainPolicies: true,
//       referrerPolicy: { policy: 'no-referrer' },
//       xssFilter: true,
//     })
//   );

app.use('/public', express.static(process.cwd() + '/public'));

const rootDir = path.join(__dirname, '/');
app.use(express.static(rootDir));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Index page (static HTML)
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
  });
app.route('/homelab')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/homelab.html');
  });

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Set up server and tests
 server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
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
