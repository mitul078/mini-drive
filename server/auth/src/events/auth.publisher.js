const redis = require("../config/redis")

exports.publishUserCreate = async(user) =>{
    await redis.publish(
        "auth:user-created",
        JSON.stringify({userId: user._id })
    )
}