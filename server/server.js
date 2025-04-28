require("dotenv").config();

const http = require("http");
const socket = require("socket.io");
const mongoose = require("mongoose");

const app = require("./app");
const socketHandlers = require("./utils/socket");

const DB = process.env.MONGO_URL;

// Database connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(":: DB Connection Successful ::"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Create HTTP server
const server = http.createServer(app);

// Start server
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Socket.io setup
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// Pass io to the socket handler
socketHandlers(io);
