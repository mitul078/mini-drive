const express = require("express")
const { createFolder } = require("./folder.controller")
const { authMiddleware } = require("../middlewares/auth.middleware")
const router = express.Router()

router.post("/", authMiddleware, createFolder)

module.exports = router