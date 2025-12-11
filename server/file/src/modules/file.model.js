const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    folderId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    userId: { type: String },
    storagePath: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("File", fileSchema)