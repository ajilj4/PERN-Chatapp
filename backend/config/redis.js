const { createClient } = require('redis');

const redis = createClient({ url: process.env.REDIS_URL });

redis.on('error', (err) => console.error('❌ Redis Error:', err));

(async () => {
    try {
        await redis.connect()
        console.log('redis conneted')
    } catch (err) {
        console.log(err)
    }

})()

module.exports = redis;
