const { subscribeToQueue } = require("./broker")
const redisClient = require("../config/redis")


module.exports = function () {
    subscribeToQueue("FOLDER_VERIFIED:FILE_SERVICE", async (data) => {
        const {userId , folderId } = data

        const key = `userId:${userId}`
        const newKey = `verifiedFolders:${folderId}`

        const prev = await redisClient.get(key)

        if(prev){
            const old = `verifiedFolders:${prev}`
            await redisClient.del(old)
        }

        await redisClient.set(
            newKey,
            JSON.stringify(data),
            "EX",
            60 * 60
        )

        await redisClient.set(key , folderId , "EX" , 60 * 60)
    })
}