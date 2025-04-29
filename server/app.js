const express = require("express");
const cors = require("cors");

const cloudRoutes = require("./routes/cloudinary");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const groupRoutes = require("./routes/group");
const groupMessageRoutes = require("./routes/groupMessages");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "https://chat-app-red-alpha.vercel.app", 
    credentials: true, 
  })
);
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from ChatApp Backend");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/cloud", cloudRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/groupmessages", groupMessageRoutes);

// Handling unhandled routes
// For all http methods
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

// Server
module.exports = app;
