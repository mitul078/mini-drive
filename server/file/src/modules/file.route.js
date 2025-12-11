const express = require("express")
const router = express.Router()
const { uploadFile } = require("./file.controller")
const { authMiddleware } = require("../middleware/auth.middleware")
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({storage})


router.post("/upload" ,authMiddleware, upload.single("file") ,uploadFile)

module.exports = router