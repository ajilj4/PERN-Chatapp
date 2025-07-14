const chatService = require('../services/chat.service');
// const { validationResult } = require('express-validator');

const createRoom = async (req, res) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({
        //         success: false,
        //         errors: errors.array()
        //     });
        // }

        const { type, name, description, members } = req.body;
        const createdBy = req.user.id;

        const room = await chatService.createRoom({
            type,
            name,
            description,
            createdBy,
            members: members || []
        });

        res.status(201).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getUserRooms = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const rooms = await chatService.getUserRooms(userId, { page, limit });

        res.json({
            success: true,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        const room = await chatService.getRoomDetails(roomId, userId);

        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;
        const { page = 1, limit = 50, before } = req.query;

        const messages = await chatService.getMessages(roomId, userId, {
            page,
            limit,
            before
        });

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { content, type = 'text', replyTo } = req.body;
        const senderId = req.user.id;
        const attachment = req.file;

        const message = await chatService.sendMessage({
            roomId,
            senderId,
            content,
            type,
            replyTo,
            attachment
        });

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const message = await chatService.editMessage(messageId, content, userId);

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;

        await chatService.deleteMessage(messageId, userId);

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;

        await chatService.markAsRead(messageId, userId);

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const addMember = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { userId: newUserId } = req.body;
        const currentUserId = req.user.id;

        const member = await chatService.addMember(roomId, newUserId, currentUserId);

        res.json({
            success: true,
            data: member
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const removeMember = async (req, res) => {
    try {
        const { roomId, userId } = req.params;
        const currentUserId = req.user.id;

        await chatService.removeMember(roomId, userId, currentUserId);

        res.json({
            success: true,
            message: 'Member removed successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user.id;

        const users = await chatService.searchUsers(query, currentUserId);

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;

        const contacts = await chatService.getContacts(userId);

        res.json({
            success: true,
            data: contacts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRoom,
    getUserRooms,
    getRoomDetails,
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    addMember,
    removeMember,
    searchUsers,
    getContacts
};
