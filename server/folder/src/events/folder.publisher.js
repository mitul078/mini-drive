const {redisPublisher} = require("../config/redis")

exports.publishFolderId = async(folder) => {
    await redisPublisher.publish("folder:verified" , JSON.stringify({folderId: folder._id , userId: folder.userId , path:folder.path}))
}