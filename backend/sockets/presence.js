// sockets/presence.js
module.exports = (io, socket) => {
  const userId = socket.user.id;

  // Broadcast online status on connect
  socket.broadcast.emit('user:online', { userId });

  // Optionally handle heartbeat or custom ping
  socket.on('presence:ping', () => {
    socket.emit('presence:pong', { timestamp: Date.now() });
  });
};
