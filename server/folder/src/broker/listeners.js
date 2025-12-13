const { subscribeToQueue } = require("./broker")
const Folder = require("../modules/folder.model")


module.exports = function () {

    subscribeToQueue("USER_CREATED:FOLDER_SERVICE", async (data) => {

        const { userId } = data

        const rootFolder = await Folder.create({
            folderName: "root",
            path: "/",
            userId
        })

        rootFolder.parentFolderId = rootFolder._id
        await rootFolder.save()
    })

}