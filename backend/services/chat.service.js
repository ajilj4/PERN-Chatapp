const {
    ChatRoom,
    ChatRoomMember,
    Message,
    MessageStatus,
    User,
    Attachment
} = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { uploadToS3Dynamic } = require('./s3Upload.service');
const redisClient = require('../config/redis');

class ChatService {
    async createRoom({ type, name, description, createdBy, members = [] }) {
        try {
            // For private chat, check if room already exists
            if (type === 'private' && members.length === 1) {
                const existingRoom = await this.findPrivateRoom(createdBy, members[0]);
                if (existingRoom) {
                    return existingRoom;
                }
            }

            // Create room
            const room = await ChatRoom.create({
                type,
                name,
                description,
                created_by: createdBy
            });

            // Add creator as admin
            await ChatRoomMember.create({
                room_id: room.id,
                user_id: createdBy,
                is_admin: true
            });

            // Add members
            if (members.length > 0) {
                const memberPromises = members.map(userId =>
                    ChatRoomMember.create({
                        room_id: room.id,
                        user_id: userId,
                        is_admin: false
                    })
                );
                await Promise.all(memberPromises);
            }

            // Get full room details
            const roomDetails = await this.getRoomDetails(room.id, createdBy);

            // Cache room in Redis
            await redisClient.setEx(`room:${room.id}`, 3600, JSON.stringify(roomDetails));

            return roomDetails;
        } catch (error) {
            throw new Error(`Failed to create room: ${error.message}`);
        }
    }

    async findPrivateRoom(userId1, userId2) {
        const room = await ChatRoom.findOne({
            where: { type: 'private' },
            include: [{
                model: ChatRoomMember,
                where: {
                    user_id: { [Op.in]: [userId1, userId2] }
                },
                required: true
            }],
            group: ['ChatRoom.id'],
            having: fn('COUNT', col('ChatRoomMembers.id'), 2)
        });

        return room;
    }

   async getUserRooms(userId, { page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    
    // Include only the 'members' association once for filtering and loading member details
    const rooms = await ChatRoom.findAndCountAll({
      include: [
        {
          model: ChatRoomMember,
          as: 'members',            // alias defined in associations.js
          where: { user_id: userId }, // filter by current user
          required: true,
          include: [{
            model: User,
            attributes: ['id', 'username', 'name', 'profile', 'is_online', 'last_seen']
          }]
        },
        {
          model: Message,
          as: 'lastMessage',        // alias defined in associations.js
          include: [{ model: User, as: 'sender', attributes: ['id', 'username', 'name'] }],
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ],
      order: [['last_activity', 'DESC']],
      limit: parseInt(limit, 10),
      offset
    });

    return {
      rooms: rooms.rows,
      total: rooms.count,
      page,
      totalPages: Math.ceil(rooms.count / limit)
    };
  }

   

    async getRoomDetails(roomId, userId) {
        try {
            // Check if user is member
            const membership = await ChatRoomMember.findOne({
                where: { room_id: roomId, user_id: userId }
            });

            if (!membership) {
                throw new Error('You are not a member of this room');
            }

            const room = await ChatRoom.findByPk(roomId, {
                include: [
                    {
                        model: ChatRoomMember,
                        include: [{
                            model: User,
                            attributes: ['id', 'username', 'name', 'profile', 'is_online', 'last_seen']
                        }]
                    }
                ]
            });

            if (!room) {
                throw new Error('Room not found');
            }

            return room;
        } catch (error) {
            throw new Error(`Failed to get room details: ${error.message}`);
        }
    }

    async getMessages(roomId, userId, { page = 1, limit = 50, before }) {
        try {
            // Verify user is member
            const membership = await ChatRoomMember.findOne({
                where: { room_id: roomId, user_id: userId }
            });

            if (!membership) {
                throw new Error('You are not a member of this room');
            }

            const offset = (page - 1) * limit;
            const whereClause = { room_id: roomId };

            if (before) {
                whereClause.createdAt = { [Op.lt]: new Date(before) };
            }

            const messages = await Message.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'name', 'profile']
                    },
                    {
                        model: Attachment,
                        required: false
                    },
                    {
                        model: Message,
                        as: 'replyToMessage',
                        include: [{
                            model: User,
                            attributes: ['id', 'username', 'name']
                        }],
                        required: false
                    },
                    {
                        model: MessageStatus,
                        required: false
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                messages: messages.rows.reverse(), // Reverse to show oldest first
                total: messages.count,
                page: parseInt(page),
                totalPages: Math.ceil(messages.count / limit)
            };
        } catch (error) {
            throw new Error(`Failed to get messages: ${error.message}`);
        }
    }

    async sendMessage({ roomId, senderId, content, type = 'text', replyTo, attachment }) {
        try {
            // Verify user is member
            const membership = await ChatRoomMember.findOne({
                where: { room_id: roomId, user_id: senderId }
            });

            if (!membership) {
                throw new Error('You are not a member of this room');
            }

            let attachmentUrl = null;
            if (attachment) {
                const uploadResult = await uploadToS3Dynamic(attachment, {
                    folder: 'messages',
                    entityId: roomId
                });
                attachmentUrl = uploadResult.url;
            }

            // Create message
            const message = await Message.create({
                room_id: roomId,
                sender_id: senderId,
                content,
                type,
                reply_to: replyTo
            });

            // Create attachment if exists
            if (attachmentUrl) {
                await Attachment.create({
                    message_id: message.id,
                    file_url: attachmentUrl,
                    file_type: attachment.mimetype
                });
            }

            // Update room last activity
            await ChatRoom.update(
                {
                    last_message_id: message.id,
                    last_activity: new Date()
                },
                { where: { id: roomId } }
            );

            // Get room members for message status
            const roomMembers = await ChatRoomMember.findAll({
                where: { room_id: roomId },
                attributes: ['user_id']
            });

            // Create message status for all members
            const statusPromises = roomMembers.map(member =>
                MessageStatus.create({
                    message_id: message.id,
                    user_id: member.user_id,
                    status: member.user_id === senderId ? 'read' : 'sent'
                })
            );
            await Promise.all(statusPromises);

            // Get full message details
            const fullMessage = await Message.findByPk(message.id, {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'name', 'profile']
                    },
                    {
                        model: Attachment,
                        required: false
                    },
                    {
                        model: Message,
                        as: 'replyToMessage',
                        include: [{
                            model: User,
                            attributes: ['id', 'username', 'name']
                        }],
                        required: false
                    }
                ]
            });

            return fullMessage;
        } catch (error) {
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }

    async editMessage(messageId, content, userId) {
        try {
            const message = await Message.findByPk(messageId);

            if (!message) {
                throw new Error('Message not found');
            }

            if (message.sender_id !== userId) {
                throw new Error('You can only edit your own messages');
            }

            await message.update({
                content,
                is_edited: true,
                edited_at: new Date()
            });

            return message;
        } catch (error) {
            throw new Error(`Failed to edit message: ${error.message}`);
        }
    }

    async deleteMessage(messageId, userId) {
        try {
            const message = await Message.findByPk(messageId);

            if (!message) {
                throw new Error('Message not found');
            }

            if (message.sender_id !== userId) {
                throw new Error('You can only delete your own messages');
            }

            await message.destroy();
        } catch (error) {
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }

    async markAsRead(messageId, userId) {
        try {
            await MessageStatus.update(
                { status: 'read', timestamp: new Date() },
                {
                    where: {
                        message_id: messageId,
                        user_id: userId
                    }
                }
            );
        } catch (error) {
            throw new Error(`Failed to mark message as read: ${error.message}`);
        }
    }

    async addMember(roomId, newUserId, currentUserId) {
        try {
            // Check if current user is admin
            const membership = await ChatRoomMember.findOne({
                where: {
                    room_id: roomId,
                    user_id: currentUserId,
                    is_admin: true
                }
            });

            if (!membership) {
                throw new Error('Only admins can add members');
            }

            // Check if user is already a member
            const existingMember = await ChatRoomMember.findOne({
                where: { room_id: roomId, user_id: newUserId }
            });

            if (existingMember) {
                throw new Error('User is already a member');
            }

            const newMember = await ChatRoomMember.create({
                room_id: roomId,
                user_id: newUserId,
                is_admin: false
            });

            return newMember;
        } catch (error) {
            throw new Error(`Failed to add member: ${error.message}`);
        }
    }

    async removeMember(roomId, userIdToRemove, currentUserId) {
        try {
            // Check if current user is admin or removing themselves
            const membership = await ChatRoomMember.findOne({
                where: {
                    room_id: roomId,
                    user_id: currentUserId
                }
            });

            if (!membership) {
                throw new Error('You are not a member of this room');
            }

            if (userIdToRemove !== currentUserId && !membership.is_admin) {
                throw new Error('Only admins can remove other members');
            }

            await ChatRoomMember.destroy({
                where: {
                    room_id: roomId,
                    user_id: userIdToRemove
                }
            });
        } catch (error) {
            throw new Error(`Failed to remove member: ${error.message}`);
        }
    }

    async searchUsers(query, currentUserId) {
        try {
            const users = await User.findAll({
                where: {
                    [Op.and]: [
                        { id: { [Op.ne]: currentUserId } },
                        {
                            [Op.or]: [
                                { username: { [Op.iLike]: `%${query}%` } },
                                { name: { [Op.iLike]: `%${query}%` } },
                                { email: { [Op.iLike]: `%${query}%` } }
                            ]
                        }
                    ]
                },
                attributes: ['id', 'username', 'name', 'profile', 'is_online', 'last_seen'],
                limit: 20
            });

            return users;
        } catch (error) {
            throw new Error(`Failed to search users: ${error.message}`);
        }
    }

    async getContacts(userId) {
        try {
            // Step 1: Get all room IDs where the user is a member
            const userRooms = await ChatRoomMember.findAll({
                where: { user_id: userId },
                attributes: ['room_id']
            });

            const roomIds = userRooms.map((room) => room.room_id);
            if (roomIds.length === 0) return [];

            // Step 2: Get all other members in these rooms (excluding current user)
            const otherMembers = await ChatRoomMember.findAll({
                where: {
                    room_id: { [Op.in]: roomIds },
                    user_id: { [Op.ne]: userId }
                },
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'name', 'profile', 'is_online', 'last_seen']
                }]
            });

            // Step 3: Extract unique users
            const contactsMap = new Map();

            for (const member of otherMembers) {
                const user = member.User;
                if (user && !contactsMap.has(user.id)) {
                    contactsMap.set(user.id, user);
                }
            }

            return Array.from(contactsMap.values());
        } catch (error) {
            throw new Error(`Failed to get contacts: ${error.message}`);
        }
    }

}

module.exports = new ChatService