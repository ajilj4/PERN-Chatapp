module.exports = (db) => {
  const {
    User,
    DeviceSession,
    OTP,
    ChatRoom,
    ChatRoomMember,
    Message,
    Attachment,
    CallSession,
    SubscriptionPlan,
    UserSubscription,
    PaymentTransaction
  } = db;

  // 👤 User Relationships
  User.hasMany(DeviceSession, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  DeviceSession.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(OTP, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  OTP.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(ChatRoomMember, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  ChatRoomMember.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(Message, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
  Message.belongsTo(User, { foreignKey: 'sender_id' });

  User.hasMany(CallSession, { foreignKey: 'initiated_by', onDelete: 'CASCADE' });
  CallSession.belongsTo(User, { foreignKey: 'initiated_by' });

  User.hasMany(UserSubscription, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  UserSubscription.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(PaymentTransaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  PaymentTransaction.belongsTo(User, { foreignKey: 'user_id' });

  // 💬 ChatRoom Relationships
  ChatRoom.hasMany(ChatRoomMember, { foreignKey: 'room_id', onDelete: 'CASCADE' });
  ChatRoomMember.belongsTo(ChatRoom, { foreignKey: 'room_id' });

  ChatRoom.hasMany(Message, { foreignKey: 'room_id', onDelete: 'CASCADE' });
  Message.belongsTo(ChatRoom, { foreignKey: 'room_id' });

  ChatRoom.hasMany(CallSession, { foreignKey: 'room_id', onDelete: 'CASCADE' });
  CallSession.belongsTo(ChatRoom, { foreignKey: 'room_id' });

  // 📨 Message & Attachment
  Message.hasOne(Attachment, { foreignKey: 'message_id', onDelete: 'CASCADE' });
  Attachment.belongsTo(Message, { foreignKey: 'message_id' });

  // 💳 Subscription Relationships
  SubscriptionPlan.hasMany(UserSubscription, { foreignKey: 'plan_id', onDelete: 'CASCADE' });
  UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id' });

  // Payment already handled under User
};
