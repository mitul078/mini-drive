const File = require("./file.model")
const imagekit = require("../config/imagekit")
const { redisClient } = require("../config/redis")
require("../events/folder.subscriber")()


exports.uploadFile = async (req, res) => {
    try {
        const { folderId } = req.body
        const userId = req.user.id

        let folder = await redisClient.get(`verifiedFolders:${folderId}`)
        console.log("Raw Redis:", folder)

        if (!folder) {
            return res.status(400).json({ msg: "invalid folderId" })
        }

        folder = JSON.parse(folder)   // ✅ FIX

        console.log("Parsed:", folder)

        if (folder.folderId !== folderId || folder.userId !== userId) {
            return res.status(400).json({ msg: "invalid folderId" })
        }

        res.status(200).json({ msg: "correct" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
