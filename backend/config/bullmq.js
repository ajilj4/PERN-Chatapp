const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL);

const otpQueue = new Queue('otpQueue', { connection });
const emailQueue = new Queue('emailQueue', { connection });

module.exports = { otpQueue, emailQueue };
