const {subscribeToQueue} = require("./broker")

module.exports = function () {
    subscribeToQueue("FOLDER_VERIFIED:FILE_SERVICE" , async(data) => {
        //data.userId and data.folderId
    })
}