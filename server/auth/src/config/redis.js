const Redis = require("ioredis")

const redis = new Redis()

redis.on("connect" , () => {
    console.log("Redis server start")
})
redis.on("error" , (err) => {
    console.log("redis error: " , err)
})

module.exports = redis