const { createServer } = require('http');
const { Server } = require('socket.io');
const { verifyAccessToken } = require('./jwt');
const redisClient = require('./redis');
const { createAdapter } = require('@socket.io/redis-adapter');

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "*",
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingInterval: 25000,
        pingTimeout: 60000,
        transports: ['websocket', 'polling']
    });

    // Redis Adapter for horizontal scaling
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        console.log('✅ Redis adapter connected');
    }).catch(err => {
        console.error('❌ Redis adapter error:', err);
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) throw new Error('Auth token missing');
            
            const payload = verifyAccessToken(token);
            
            // Store user info in socket
            socket.user = {
                id: payload.userId,
                email: payload.email
            };
            
            // Join user to their personal room
            socket.join(`user:${payload.userId}`);
            
            next();
        } catch (err) {
            console.log('Socket auth error:', err);
            next(new Error('Authentication failed'));
        }
    });

    // Connection handler
    io.on('connection', async (socket) => {
        console.log(`✅ User ${socket.user.id} connected`);
        
        // Update user online status
        await updateUserOnlineStatus(socket.user.id, true);
        
        // Notify contacts about online status
        await notifyContactsOnlineStatus(socket.user.id, true, io);

        // Initialize socket handlers
        require('../sockets/chat')(io, socket);
        require('../sockets/call')(io, socket);
        require('../sockets/presence')(io, socket);

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`❌ User ${socket.user.id} disconnected`);
            await updateUserOnlineStatus(socket.user.id, false);
            await notifyContactsOnlineStatus(socket.user.id, false, io);
        });
    });

    return io;
}

// Helper functions
async function updateUserOnlineStatus(userId, isOnline) {
    try {
        const User = require('../models/User');
        await User.update(
            { 
                is_online: isOnline,
                last_seen: new Date()
            },
            { where: { id: userId } }
        );
        
        // Store in Redis for quick access
        await redisClient.setEx(`user:${userId}:online`, 3600, isOnline.toString());
    } catch (error) {
        console.error('Error updating user online status:', error);
    }
}

async function notifyContactsOnlineStatus(userId, isOnline, io) {
    try {
        // Get user's contacts/chat rooms
        const { ChatRoomMember } = require('../models');
        const userRooms = await ChatRoomMember.findAll({
            where: { user_id: userId },
            attributes: ['room_id']
        });

        // Notify all rooms about status change
        userRooms.forEach(room => {
            io.to(`room:${room.room_id}`).emit('user:status_change', {
                userId,
                isOnline,
                timestamp: new Date()
            });
        });
    } catch (error) {
        console.error('Error notifying contacts:', error);
    }
}

module.exports = initSocket;