const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.Controller');
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/multer.middleware');

// Chat room routes
router.post('/rooms', authMiddleware, chatController.createRoom);
router.get('/rooms', authMiddleware, chatController.getUserRooms);
router.get('/rooms/:roomId', authMiddleware, chatController.getRoomDetails);
router.post('/rooms/:roomId/members', authMiddleware, chatController.addMember);
router.delete('/rooms/:roomId/members/:userId', authMiddleware, chatController.removeMember);

// Message routes
router.get('/rooms/:roomId/messages', authMiddleware, chatController.getMessages);
router.post('/rooms/:roomId/messages', authMiddleware, upload.single('attachment'), chatController.sendMessage);
router.put('/messages/:messageId', authMiddleware, chatController.editMessage);
router.delete('/messages/:messageId', authMiddleware, chatController.deleteMessage);
router.post('/messages/:messageId/read', authMiddleware, chatController.markAsRead);

// Search and contacts
router.get('/search/users', authMiddleware, chatController.searchUsers);
router.get('/contacts', authMiddleware, chatController.getContacts);

module.exports = router;