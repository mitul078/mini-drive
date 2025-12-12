const mongoose = require("mongoose")
const folderSchema = new mongoose.Schema({

    folderName: { type: String, required: true, trim: true },
    parentFolderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    userId: { type: String, required: true },
    path: { type: String, required: true },

}, { timestamps: true })

// Compound unique index: folderName + userId (allows same folderName for different users)
folderSchema.index({ folderName: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("Folder" , folderSchema)