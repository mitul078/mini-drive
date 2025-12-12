const { redisSubscriber, redisClient } = require("../config/redis")


module.exports = function StartFolderSubscribers() {
    redisSubscriber.subscribe("folder:verified", (err) => {
        if (err) {
            console.log("Folder subscriber error:", err)
            return
        }
        console.log("Subscribed to: folder:verified")
    })

    redisSubscriber.on("message", async (channel, message) => {
        if (channel === "folder:verified") {
            const data = await JSON.parse(message)
            const newFolderId = data.folderId

            const prevFolderId  = await redisClient.get("verifiedFolders:current")

            if(prevFolderId)
                await redisClient.del(`verifiedFolders:${prevFolderId}`)

            await redisClient.set(
                `verifiedFolders:${newFolderId}`, JSON.stringify(data) , "EX", 3600
            )

            await redisClient.set("verifiedFolders:current" , newFolderId)
        }
    })


}

module.exports.verifiedFolder = () => verifiedFolder;
