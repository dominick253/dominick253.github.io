//   ____                                                __                  __      __          __                  __
//  /\  _`\                       __          __        /\ \                /\ \  __/\ \        /\ \              __/\ \__
//  \ \ \/\ \    ___     ___ ___ /\_\    ___ /\_\    ___\ \ \/'\     ____   \ \ \/\ \ \ \     __\ \ \____    ____/\_\ \ ,_\    __
//   \ \ \ \ \  / __`\ /' __` __`\/\ \ /' _ `\/\ \  /'___\ \ , <    /',__\   \ \ \ \ \ \ \  /'__`\ \ '__`\  /',__\/\ \ \ \/  /'__`\
//    \ \ \_\ \/\ \L\ \/\ \/\ \/\ \ \ \/\ \/\ \ \ \/\ \__/\ \ \\`\ /\__, `\   \ \ \_/ \_\ \/\  __/\ \ \L\ \/\__, `\ \ \ \ \_/\  __/
//     \ \____/\ \____/\ \_\ \_\ \_\ \_\ \_\ \_\ \_\ \____\\ \_\ \_\/\____/    \ `\___x___/\ \____\\ \_,__/\/\____/\ \_\ \__\ \____\
//      \/___/  \/___/  \/_/\/_/\/_/\/_/\/_/\/_/\/_/\/____/ \/_/\/_/\/___/      '\/__//__/  \/____/ \/___/  \/___/  \/_/\/__/\/____/

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const helmet = require("helmet");
const portNum = 3000;
const ipaddress = "10.71.71.115";
const user = "adminer";
const password = process.env.DB_PASSWORD;
const path = require("path");
const app = express();
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const server = require("http").Server(app);
const io = socket(server);

const connection = mysql.createPool({
  host: ipaddress,
  user: user,
  password: password,
  database: "files",
  connectionLimit: 20,
});

connection.on("connection", function (connection) {
  console.log("DB Connection established");

  connection.on("error", function (err) {
    console.error(new Date(), "MySQL error", err.code);
  });
  connection.on("close", function (err) {
    console.error(new Date(), "MySQL close", err);
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

io.on("connection", function (socket) {
  console.log("A user connected");
  socket.emit("connected", { id: socket.id });

  socket.on("disconnect", function () {
    console.log("A user disconnected");
    io.emit("playerDisconnect", { id: socket.id });
  });
});

// app.use((req, res, next) => {
//   if (req.path.includes(".git") || req.path.includes("no")) {
//     console.log(`Blocked access to: ${req.path}`);
//     res.status(403).sendFile(path.join(__dirname, "no.html"));
//   } else {
//     next();
//   }
// });

app.use((req, res, next) => {
  res.setHeader("Surrogate-Control", "no-store");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          "https://10.71.71.43:8080",
          "http://10.71.71.43:8080",
        ],
        connectSrc: [
          "'self'",
          "https://10.71.71.43:8080",
          "http://10.71.71.43:8080",
        ],
        styleSrc: [
          "'self'",
          "maxcdn.bootstrapcdn.com",
          "cdn.credly.com",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css",
          "'unsafe-inline'",
          "https://use.fontawesome.com",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-eval'",
          "cdnjs.cloudflare.com",
          "cdn.credly.com",
          "'unsafe-inline'",
          "unpkg.com",
          "https://use.fontawesome.com",
          "https://code.jquery.com/jquery-3.5.1.min.js",
        ],
        fontSrc: [
          "'self'",
          "cdn.credly.com",
          "https://fonts.gstatic.com",
          "https://use.fontawesome.com",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: [
          "'self'",
          "cdn.credly.com",
          "https://i.imgur.com",
          "blob:",
          "data:",
        ],
        frameSrc: [
          "'self'",
          "https://www.youtube.com",
          "https://www.credly.com",
          "https://www.youtube-nocookie.com",
        ],
        mediaSrc: ["'self'", "https://s3.amazonaws.com", "blob:", "data:"],
      },
    },
    dnsPrefetchControl: false,
    expectCt: { maxAge: 0 },
    frameguard: { action: "sameorigin" },
    hidePoweredBy: { setTo: "PHP 7.4.3" },
    hsts: { maxAge: 0 },
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true,
  })
);

app.use("/public", express.static(process.cwd() + "/public"));

const rootDir = path.join(__dirname, "/");
app.use(express.static(rootDir));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/index.html");
});
app.route("/viewCount").get(function (req, res) {
  connection.query("INSERT INTO views () VALUES (NULL)");
  connection.query(
    "SELECT COUNT(*) AS viewCount FROM views",
    function (error, results, fields) {
      if (error) {
        console.error(error);
        throw error;
      }
      res.json({ viewCount: results[0].viewCount });
    }
  );
});
app.route("/homelab").get(function (req, res) {
  res.sendFile(process.cwd() + "/homelab.html");
});
app.route("/projects").get(function (req, res) {
  res.sendFile(process.cwd() + "/projects.html");
});
app.route("/videos").get(function (req, res) {
  res.sendFile(process.cwd() + "/videos.html");
});
app.route("/files").get(function (req, res) {
  res.sendFile(process.cwd() + "/files.html");
});
app.route("/ai").get(function (req, res) {
  res.sendFile(process.cwd() + "/ai.html");
});

// Route to handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  const { originalname, filename } = req.file;
  const { uploaded_by } = req.body;

  // Save file details to the database
  const insertQuery =
    "INSERT INTO files (name, uploaded_by, file_path) VALUES (?, ?, ?)";
  connection.query(
    insertQuery,
    [originalname, uploaded_by, filename],
    (err, result) => {
      if (err) {
        console.error("Error inserting file details into the database:", err);
        res.status(500).json({ error: "Failed to upload file" });
      } else {
        res.json({ message: "File uploaded successfully" });
      }
    }
  );
});

// Route to handle file download
app.get("/api/files", (req, res) => {
  // Select all files from the database
  const selectQuery = "SELECT * FROM files";
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving file list from the database:", err);
      res.status(500).json({ error: "Failed to fetch file list" });
    } else {
      res.json(results);
    }
  });
});

app.get("/download/:fileId", (req, res) => {
  const fileId = req.params.fileId;

  // Retrieve the file details from the database
  const selectQuery = "SELECT file_path FROM files WHERE id = ?";
  connection.query(selectQuery, [fileId], (err, results) => {
    if (err) {
      console.error("Error retrieving file details from the database:", err);
      res.status(500).json({ error: "Failed to download file" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "File not found" });
      } else {
        const filePath = path.join(__dirname, "uploads", results[0].file_path);
        res.download(filePath, (err) => {
          if (err) {
            console.error("Error serving file for download:", err);
            res.status(500).json({ error: "Failed to download file" });
          }
        });
      }
    }
  });
});

app.delete("/api/files/:fileId", (req, res) => {
  const fileId = req.params.fileId;

  // Retrieve the file details from the database
  const selectQuery = "SELECT file_path FROM files WHERE id = ?";
  connection.query(selectQuery, [fileId], (err, results) => {
    if (err) {
      console.error("Error retrieving file details from the database:", err);
      res.status(500).json({ error: "Failed to delete file" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "File not found" });
      } else {
        const filePath = path.join(__dirname, "uploads", results[0].file_path);

        // Delete the file from the file system
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            res.status(500).json({ error: "Failed to delete file" });
          } else {
            // Delete the file record from the database
            const deleteQuery = "DELETE FROM files WHERE id = ?";
            connection.query(deleteQuery, [fileId], (err, results) => {
              if (err) {
                console.error(
                  "Error deleting file record from the database:",
                  err
                );
                res.status(500).json({ error: "Failed to delete file" });
              } else {
                res.json({ message: "File deleted successfully" });
              }
            });
          }
        });
      }
    }
  });
});

app.get("/guestbook", function (req, res) {
  connection.query(
    "SELECT * FROM guestbook ORDER BY date DESC",
    function (err, rows) {
      if (err) throw err;

      res.send(rows);
    }
  );
});

app.post("/guestbook", function (req, res) {
  var post = { name: req.body.name, comment: req.body.comment };
  connection.query("INSERT INTO guestbook SET ?", post, function (err) {
    if (err) throw err;

    res.send({ status: "success" });
  });
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const aiResponse = await axios.post(
      "http://10.71.71.43:8080/v1/chat/completions",
      {
        model: "phi-2",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
      }
    );

    // Send back the AI's response
    res.json(aiResponse.data);
  } catch (error) {
    console.error("Error communicating with the AI:", error);
    res.status(500).send("Error communicating with the AI");
  }
});

// 404 Not Found Middleware
// app.use(function (req, res, next) {
//   res.status(404).type("text").send("Not Found");
// });
// Catch-all handler
app.use((req, res) => {
  console.log(`Blocked access to: ${req.path}`);
  res.status(404).sendFile(path.join(__dirname, "no.html"));
});

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});

module.exports = app; // For testing
