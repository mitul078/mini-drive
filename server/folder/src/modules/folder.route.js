const express = require("express")
const { createFolder, checkFolderId } = require("./folder.controller")
const { authMiddleware } = require("../middlewares/auth.middleware")
const router = express.Router()

router.post("/", authMiddleware, createFolder)
router.get("/:id" , authMiddleware , checkFolderId) //check folder exits or not for file creation

module.exports = router