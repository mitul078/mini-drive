const express = require("express")
const router = express.Router()
const { uploadFile, getFiles, deleteFile } = require("./file.controller")
const { authMiddleware } = require("../middleware/auth.middleware")
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({storage})


router.post("/upload" ,authMiddleware, upload.single("file") ,uploadFile)
router.get("/:id" , authMiddleware , getFiles) //folder-id
router.delete("/:id" , authMiddleware , deleteFile) //file-id

module.exports = router