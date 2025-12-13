require("dotenv").config()
const app = require("./src/app")
const connectDB  = require("./src/config/db")
const {connect} = require("./src/broker/broker")
const setListeners = require("./src/broker/listeners")

connectDB()
connect().then(() => {
    setListeners()
})


app.listen(process.env.PORT , () => {
    console.log("Server start(file)")
})