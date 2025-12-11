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

            await redisClient.set(
                `verifiedFolders:${data.folderId}`, JSON.stringify(data)
            )

            console.log("Cached verified folder:", data);
        }
    })


}

module.exports.verifiedFolder = () => verifiedFolder;
