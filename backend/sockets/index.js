// sockets/index.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.user.username} (${socket.user.id})`);

    // Initialize feature modules
    require('./chat')(io, socket);
    require('./call')(io, socket);
    require('./presence')(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`🔴 User disconnected: ${socket.user.id} – ${reason}`);
      // Optionally broadcast offline presence
      socket.broadcast.emit('user:offline', { userId: socket.user.id });
    });
  });
};
