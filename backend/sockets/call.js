// sockets/call.js
module.exports = (io, socket) => {
  const userId = socket.user.id;

  // Initiate call
  socket.on('call:initiate', ({ toUserId, roomId, callType }) => {
    // Notify callee
    io.to(toUserId).emit('call:incoming', {
      from: userId,
      roomId,
      callType
    });
  });

  // Accept call
  socket.on('call:accept', ({ roomId }) => {
    socket.join(roomId);
    io.to(roomId).emit('call:accepted', { roomId, by: userId });
  });

  // Reject call
  socket.on('call:reject', ({ roomId }) => {
    io.to(roomId).emit('call:rejected', { roomId, by: userId });
  });

  // Signaling (WebRTC)
  socket.on('call:signal', ({ roomId, data }) => {
    socket.to(roomId).emit('call:signal', { from: userId, data });
  });

  // End call
  socket.on('call:end', ({ roomId }) => {
    io.to(roomId).emit('call:ended', { roomId, by: userId });
    socket.leave(roomId);
  });
};
