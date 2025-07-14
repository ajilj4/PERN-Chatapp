// sockets/chat.js
const { Message, ChatRoom, Attachment } = require('../models');

module.exports = (io, socket) => {
  const userId = socket.user.id;

  // Join room
  socket.on('chat:join', async ({ roomId }) => {
    socket.join(roomId);
    socket.emit('chat:joined', { roomId });
  });

  // Leave room
  socket.on('chat:leave', ({ roomId }) => {
    socket.leave(roomId);
    socket.emit('chat:left', { roomId });
  });

  // Send message
  socket.on('chat:message', async ({ roomId, content, attachment }) => {
    // Persist message
    const msg = await Message.create({
      room_id: roomId,
      sender_id: userId,
      content
    });

    // Persist attachment if provided
    let attach = null;
    if (attachment) {
      attach = await Attachment.create({
        message_id: msg.id,
        file_url: attachment.url,
        file_type: attachment.type
      });
    }

    // Fetch full payload
    const payload = {
      id: msg.id,
      roomId,
      senderId: userId,
      content,
      attachment: attach ? { id: attach.id, url: attach.file_url } : null,
      createdAt: msg.createdAt
    };

    // Broadcast to room
    io.to(roomId).emit('chat:message', payload);
  });

  // Typing indicator
  socket.on('chat:typing', ({ roomId, isTyping }) => {
    socket.to(roomId).emit('chat:typing', {
      userId,
      roomId,
      isTyping
    });
  });
};
