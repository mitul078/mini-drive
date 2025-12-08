const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")


app.use(express.json())
app.use(cookieParser())

const apiLimit = rateLimit({
    windowMs: 10 * 1000,
    max:5,
    message: "Too many requests"
})

app.use(apiLimit)


app.use("/api/v1/auth" , require("./modules/auth/auth.route"))

module.exports = app