let onlineUsers = new Map();

const socketHandlers = (io) => {
  global.io = io;

  io.on("connection", (socket) => {
    console.log(`⚡ New connection: ${socket.id}`);
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
      }
    });

    socket.on("send-notification", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("notification-recieve", data.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected: ${socket.id}`);
      // Remove the user from the onlineUsers map
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      });
    });
  });
};

module.exports = socketHandlers;
module.exports.onlineUsers = onlineUsers; 
