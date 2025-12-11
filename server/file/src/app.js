const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/file" , require("./modules/file.route"))

module.exports = app