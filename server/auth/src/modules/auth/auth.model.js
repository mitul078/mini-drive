const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },

    username: { type: String, required: true, unique: true, index: true },

    email: { type: String, required: true, unique: true, index: true },

    password: { type: String, required: true },

    role: { type: String, enum: ["admin", "user"], default: "user" }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)