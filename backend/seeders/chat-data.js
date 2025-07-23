#!/usr/bin/env node

require('dotenv').config();
const { 
  User, 
  ChatRoom, 
  ChatRoomMember, 
  Message, 
  MessageStatus, 
  Attachment,
  Notification,
  Activity
} = require('../models');

const seedChatData = async () => {
  try {
    console.log('🗣️ Starting chat data seeding...\n');

    // Get all users
    const users = await User.findAll();
    if (users.length < 2) {
      console.log('❌ Need at least 2 users to create chat data. Please run user seeding first.');
      return;
    }

    console.log(`Found ${users.length} users for chat seeding`);

    // Clear existing chat data
    console.log('🧹 Clearing existing chat data...');
    await MessageStatus.destroy({ where: {}, force: true });
    await Attachment.destroy({ where: {}, force: true });
    await Message.destroy({ where: {}, force: true });
    await ChatRoomMember.destroy({ where: {}, force: true });
    await ChatRoom.destroy({ where: {}, force: true });
    console.log('✅ Existing chat data cleared\n');

    // Create chat rooms
    console.log('💬 Creating chat rooms...');
    
    // 1. Private chat between John and Jane
    const privateRoom1 = await ChatRoom.create({
      name: null, // Private chats don't have names
      type: 'private',
      description: null,
      created_by: users[0].id, // John
      last_activity: new Date()
    });

    // 2. Private chat between John and Mike
    const privateRoom2 = await ChatRoom.create({
      name: null,
      type: 'private', 
      description: null,
      created_by: users[0].id, // John
      last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    });

    // 3. Group chat - "Team Discussion"
    const groupRoom1 = await ChatRoom.create({
      name: 'Team Discussion',
      type: 'group',
      description: 'General team discussion and updates',
      created_by: users[3].id, // Sarah (Admin)
      last_activity: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    });

    // 4. Group chat - "Project Alpha"
    const groupRoom2 = await ChatRoom.create({
      name: 'Project Alpha',
      type: 'group',
      description: 'Discussion about Project Alpha development',
      created_by: users[0].id, // John
      last_activity: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    });

    // 5. Group chat - "Random Chat"
    const groupRoom3 = await ChatRoom.create({
      name: 'Random Chat',
      type: 'group',
      description: 'Casual conversations and fun stuff',
      created_by: users[1].id, // Jane
      last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    });

    const rooms = [privateRoom1, privateRoom2, groupRoom1, groupRoom2, groupRoom3];
    console.log(`✅ Created ${rooms.length} chat rooms\n`);

    // Create chat room members
    console.log('👥 Adding members to chat rooms...');
    
    const memberships = [
      // Private room 1: John & Jane
      { room_id: privateRoom1.id, user_id: users[0].id, is_admin: true },  // John
      { room_id: privateRoom1.id, user_id: users[1].id, is_admin: false }, // Jane
      
      // Private room 2: John & Mike
      { room_id: privateRoom2.id, user_id: users[0].id, is_admin: true },  // John
      { room_id: privateRoom2.id, user_id: users[2].id, is_admin: false }, // Mike
      
      // Group room 1: Team Discussion (Sarah, John, Jane, Mike)
      { room_id: groupRoom1.id, user_id: users[3].id, is_admin: true },  // Sarah (Admin)
      { room_id: groupRoom1.id, user_id: users[0].id, is_admin: false }, // John
      { room_id: groupRoom1.id, user_id: users[1].id, is_admin: false }, // Jane
      { room_id: groupRoom1.id, user_id: users[2].id, is_admin: false }, // Mike
      
      // Group room 2: Project Alpha (John, Jane, Mike)
      { room_id: groupRoom2.id, user_id: users[0].id, is_admin: true },  // John (Creator)
      { room_id: groupRoom2.id, user_id: users[1].id, is_admin: false }, // Jane
      { room_id: groupRoom2.id, user_id: users[2].id, is_admin: false }, // Mike
      
      // Group room 3: Random Chat (Jane, John, Alex)
      { room_id: groupRoom3.id, user_id: users[1].id, is_admin: true },  // Jane (Creator)
      { room_id: groupRoom3.id, user_id: users[0].id, is_admin: false }, // John
      { room_id: groupRoom3.id, user_id: users[4].id, is_admin: false }, // Alex
    ];

    await ChatRoomMember.bulkCreate(memberships);
    console.log(`✅ Added ${memberships.length} room memberships\n`);

    // Create messages
    console.log('💬 Creating messages...');
    
    const messages = [
      // Private chat 1 messages (John & Jane)
      {
        room_id: privateRoom1.id,
        sender_id: users[0].id, // John
        content: "Hey Jane! How's your day going?",
        type: 'text',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        room_id: privateRoom1.id,
        sender_id: users[1].id, // Jane
        content: "Hi John! It's going great, thanks for asking. How about yours?",
        type: 'text',
        created_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
        updated_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
      },
      {
        room_id: privateRoom1.id,
        sender_id: users[0].id, // John
        content: "Pretty good! Working on the new chat features. Want to test them out?",
        type: 'text',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        room_id: privateRoom1.id,
        sender_id: users[1].id, // Jane
        content: "Absolutely! I'd love to help test them.",
        type: 'text',
        created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        updated_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
      },

      // Private chat 2 messages (John & Mike)
      {
        room_id: privateRoom2.id,
        sender_id: users[0].id, // John
        content: "Mike, did you see the latest updates to the project?",
        type: 'text',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        room_id: privateRoom2.id,
        sender_id: users[2].id, // Mike
        content: "Yes! The new features look amazing. Great work!",
        type: 'text',
        created_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
        updated_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000)
      },

      // Group chat 1 messages (Team Discussion)
      {
        room_id: groupRoom1.id,
        sender_id: users[3].id, // Sarah
        content: "Good morning team! Let's discuss today's priorities.",
        type: 'text',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        room_id: groupRoom1.id,
        sender_id: users[0].id, // John
        content: "Morning Sarah! I'm focusing on the chat system improvements today.",
        type: 'text',
        created_at: new Date(Date.now() - 5.5 * 60 * 60 * 1000), // 5.5 hours ago
        updated_at: new Date(Date.now() - 5.5 * 60 * 60 * 1000)
      },
      {
        room_id: groupRoom1.id,
        sender_id: users[1].id, // Jane
        content: "I'll be working on the subscription management features.",
        type: 'text',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        room_id: groupRoom1.id,
        sender_id: users[2].id, // Mike
        content: "I'm handling the database optimizations and testing.",
        type: 'text',
        created_at: new Date(Date.now() - 4.5 * 60 * 60 * 1000), // 4.5 hours ago
        updated_at: new Date(Date.now() - 4.5 * 60 * 60 * 1000)
      },

      // Group chat 2 messages (Project Alpha)
      {
        room_id: groupRoom2.id,
        sender_id: users[0].id, // John
        content: "Project Alpha is making great progress! 🚀",
        type: 'text',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        room_id: groupRoom2.id,
        sender_id: users[1].id, // Jane
        content: "The new UI components are looking fantastic!",
        type: 'text',
        created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        updated_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
      },
      {
        room_id: groupRoom2.id,
        sender_id: users[2].id, // Mike
        content: "Should we schedule a demo for next week?",
        type: 'text',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },

      // Group chat 3 messages (Random Chat)
      {
        room_id: groupRoom3.id,
        sender_id: users[1].id, // Jane
        content: "Anyone up for a coffee break? ☕",
        type: 'text',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        room_id: groupRoom3.id,
        sender_id: users[0].id, // John
        content: "Count me in! I could use a break.",
        type: 'text',
        created_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
        updated_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
      },
      {
        room_id: groupRoom3.id,
        sender_id: users[4].id, // Alex
        content: "Sorry, I'm in a meeting. Maybe next time!",
        type: 'text',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    const createdMessages = await Message.bulkCreate(messages);
    console.log(`✅ Created ${createdMessages.length} messages\n`);

    // Update last_message_id for rooms
    console.log('🔗 Updating room last messages...');
    for (const room of rooms) {
      const lastMessage = await Message.findOne({
        where: { room_id: room.id },
        order: [['createdAt', 'DESC']]
      });
      
      if (lastMessage) {
        await room.update({ 
          last_message_id: lastMessage.id,
          last_activity: lastMessage.createdAt
        });
      }
    }
    console.log('✅ Updated room last messages\n');

    console.log('🎉 Chat data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Chat rooms: ${rooms.length}`);
    console.log(`- Room memberships: ${memberships.length}`);
    console.log(`- Messages: ${createdMessages.length}`);
    console.log('\n💬 Chat Rooms Created:');
    console.log('1. Private: John ↔ Jane');
    console.log('2. Private: John ↔ Mike');
    console.log('3. Group: Team Discussion (Sarah, John, Jane, Mike)');
    console.log('4. Group: Project Alpha (John, Jane, Mike)');
    console.log('5. Group: Random Chat (Jane, John, Alex)');

  } catch (error) {
    console.error('❌ Error seeding chat data:', error);
    throw error;
  }
};

module.exports = seedChatData;

// Run if called directly
if (require.main === module) {
  seedChatData().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
