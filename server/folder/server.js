require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")
// start listening for auth events to create user root folder
const {startAuthSubscriber} =require("./src/events/auth.subscriber")

startAuthSubscriber()
connectDB()

app.listen(process.env.PORT, () => {
    console.log("Server start")
})