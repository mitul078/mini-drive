const Redis = require("ioredis")

const redisPublisher = new Redis({
    host: "127.0.0.1",
    port: 6379
})
const redisSubscriber = new Redis({
    host: "127.0.0.1",
    port: 6379
})
const redisClient = new Redis({
    host: "127.0.0.1",
    port: 6379
})



redisPublisher.on("connect" , () => {
    console.log("Redis start(file)")
})
redisClient.on("connect" , () => {
    console.log("Redis start(file)")
})
redisSubscriber.on("on" , () => {
    console.log("Redis start" )
})

module.exports = {redisPublisher , redisSubscriber , redisClient}