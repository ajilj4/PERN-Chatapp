

module.exports = function associateModels(db) {
  const {
    User,
    DeviceSession,
    OTP,
    PasswordReset,
    ChatRoom,
    ChatRoomMember,
    Message,
    MessageStatus,
    Attachment,
    CallSession,
    SubscriptionPlan,
    UserSubscription,
    PaymentTransaction,
    Notification,
    Setting,
    Activity
  } = db;

  // 👤 User Relationships
  User.hasMany(DeviceSession, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  DeviceSession.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(OTP, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  OTP.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(PasswordReset, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  PasswordReset.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(ChatRoomMember, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  ChatRoomMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasMany(Message, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
  Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

  User.hasMany(CallSession, { foreignKey: 'initiated_by', onDelete: 'CASCADE' });
  CallSession.belongsTo(User, { foreignKey: 'initiated_by', as: 'initiator' });

  User.hasMany(UserSubscription, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  UserSubscription.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(PaymentTransaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  PaymentTransaction.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'recipient' });
  Notification.belongsTo(User, { foreignKey: 'actor_id', as: 'actor' });

  User.hasMany(Setting, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Setting.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(Activity, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Activity.belongsTo(User, { foreignKey: 'user_id' });

  // 💬 ChatRoom Relationships
  ChatRoom.hasMany(ChatRoomMember, { foreignKey: 'room_id', onDelete: 'CASCADE', as: 'members' });
  ChatRoomMember.belongsTo(ChatRoom, { foreignKey: 'room_id', as: 'room' });

  // All messages in a room
  ChatRoom.hasMany(Message, { foreignKey: 'room_id', onDelete: 'CASCADE', as: 'messages' });
  Message.belongsTo(ChatRoom, { foreignKey: 'room_id' });

  // Last message alias on ChatRoom
  ChatRoom.belongsTo(Message, { foreignKey: 'last_message_id', as: 'lastMessage' });

  // Calls in a room
  ChatRoom.hasMany(CallSession, { foreignKey: 'room_id', onDelete: 'CASCADE' });
  CallSession.belongsTo(ChatRoom, { foreignKey: 'room_id' });

  // 📨 Message ↔ Attachment and Status
  Message.hasOne(Attachment, { foreignKey: 'message_id', onDelete: 'CASCADE', as: 'attachment' });
  Attachment.belongsTo(Message, { foreignKey: 'message_id' });

  Message.hasMany(MessageStatus, { foreignKey: 'message_id', onDelete: 'CASCADE', as: 'statuses' });
  MessageStatus.belongsTo(Message, { foreignKey: 'message_id' });

  // 💳 Subscription Relationships
  SubscriptionPlan.hasMany(UserSubscription, { foreignKey: 'plan_id', onDelete: 'CASCADE' });
  UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id' });

  // Make sure to call this after all models are defined:
  // Object.keys(db).forEach(name => { if (db[name].associate) db[name].associate(db); });
};
