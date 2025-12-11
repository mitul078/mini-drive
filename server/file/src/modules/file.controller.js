const File = require("./file.model")
const imagekit = require("../config/imagekit")
const { redisClient } = require("../config/redis")
require("../events/folder.subscriber")()


exports.uploadFile = async (req, res) => {
    try {
        const { folderId } = req.body
        const userId = req.user.id
        const file = req.file


        let folder = await redisClient.get(`verifiedFolders:${folderId}`)

        if (!folder) {
            return res.status(400).json({ msg: "invalid folderId" })
        }

        folder = JSON.parse(folder)

        if (folder.folderId !== folderId || folder.userId !== userId) {
            return res.status(400).json({ msg: "invalid folderId" })
        }


        if (!file)
            return res.status(400).json({ msg: "File required" })

        const allowedType = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]

        if (!allowedType.includes(file.mimetype)) {
            return res.status(400).json({ msg: "Only images and pdf are allowed" })
        }

        const upload = await imagekit.upload({
            file: file.buffer,
            fileName: `${userId}-${file.originalname}`,
            folder: "mini-drive"
        })

        const saveFile = await File.create({
            fileName: file.originalname,
            userId,
            size: upload.size,
            folderId,
            mimeType: file.mimetype,
            url: upload.url,
            folderPath: `${folder.path}/${file.originalname}`
        })

        res.status(200).json({
            msg: "file uploaded",
            saveFile

        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
