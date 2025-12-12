const File = require("./file.model")
const imagekit = require("../config/imagekit")
const { redisClient } = require("../config/redis")
const crypto = require("crypto")
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
            fileId: upload.fileId,
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

exports.getFiles = async (req, res) => {
    try {

        const { id } = req.params //folder-id
        const userId = req.user.id

        const files = await File.find({ folderId: id, userId })
        if (files.length === 0)
            return res.status(400).json({ msg: "no files" })

        res.status(200).json({
            msg: "Files fetched",
            files
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.deleteFile = async (req, res) => {
    try {

        const { id } = req.params
        const userId = req.user.id

        const file = await File.findOne({ _id: id, userId })
        if (!file)
            return res.status(404).json({ msg: "File not found" })

        await imagekit.deleteFile(file.fileId)

        await File.findByIdAndDelete(id)
        res.status(200).json({ msg: "File deleted" })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



