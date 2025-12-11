const Redis = require("ioredis")

const redisSubscriber = new Redis({
    host: "127.0.0.1",
    port: 6379
})
const redisPublisher = new Redis({
    host: "127.0.0.1",
    port: 6379
})

redisSubscriber.on("connect", () => {
    console.log("✅ Redis connected")
})

redisPublisher.on("connect", () => {
    console.log("✅ Redis connected")
})


module.exports = {redisPublisher , redisSubscriber}