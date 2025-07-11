const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Client');
const path = require('path');

const uploadToS3Dynamic = async (file, options = {}) => {

   if (!file) {
        throw new Error('No file provided for upload');
    }

  const {
    folder = 'others',     // eg: chat, user, status
    entityId = 'general',  // eg: userId, chatId
    customPrefix = '',     // eg: 'avatar', 'banner'
  } = options;

  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const base = path.basename(file.originalname, ext).replace(/\s+/g, '-');

  // Final file key like: chat/user1_user2/ts-photo.jpg OR user/user123/avatar.jpg
  const prefix = customPrefix ? `${customPrefix}-` : '';
  const key = `${folder}/${entityId}/${prefix}${timestamp}-${base}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentLength:file.size
  });

  await s3.send(command);

  const url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${key}`;
  return { key, url };
};

module.exports = { uploadToS3Dynamic };
