const Redis = require("ioredis")

const redisPublisher = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
})
const redisSubscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
})

redisSubscriber.on("connect", () => {
    console.log("✅ Redis connected")
})

redisPublisher.on("connect", () => {
    console.log("✅ Redis connected")
})


module.exports = { redisPublisher, redisSubscriber }