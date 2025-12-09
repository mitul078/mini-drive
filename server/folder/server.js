require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")

const { startAuthSubscriber } = require("./src/events/auth.subscriber")

connectDB()
startAuthSubscriber()

app.listen(process.env.PORT, () => {
    console.log("Server start")
})