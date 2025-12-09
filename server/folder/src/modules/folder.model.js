const mongoose = require("mongoose")
const folderSchema = new mongoose.Schema({

    folderName: { type: String, required: true, unique: true, trim: true },
    parentFolderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    userId: { type: String, required: true },
    path: { type: String, required: true },

}, { timestamps: true })

module.exports = mongoose.model("Folder" , folderSchema)