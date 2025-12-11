const mongoose = require("mongoose")

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("DB connected(file)"))
        .catch(err => console.log("DB error:", err))
}

module.exports = connectDB