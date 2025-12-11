const express = require("express")
const router = express.Router()
const { uploadFile } = require("./file.controller")
const { authMiddleware } = require("../middleware/auth.middleware")

router.post("/upload" ,authMiddleware ,uploadFile)

module.exports = router