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
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
})



redisPublisher.on("connect", () => {
    console.log("Redis start(file)")
})
redisClient.on("connect", () => {
    console.log("Redis start(file)")
})
redisSubscriber.on("on", () => {
    console.log("Redis start")
})

module.exports = { redisPublisher, redisSubscriber, redisClient }