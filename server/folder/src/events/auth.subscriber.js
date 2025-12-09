const redis = require("../config/redis")
const Folder = require("../modules/folder.model")


async function startAuthSubscriber() {
    console.log("starting the auth subscriber")
    
    redis.subscribe("auth:user-created" , (err) => {
        if(err){
            console.log("Auth sub error: ", err)
            return

        }
        console.log("Auth subscribe the auth:user-created")
        
    })

    redis.on("message", async (channel, message) => {
        if (channel == "auth:user-created") {
            
            const {userId} = JSON.parse(message)

            await Folder.create({
                folderName:"root",
                path: "/",
                parentFolderId: null,
                userId
            })
        }
    })
}

module.exports = {startAuthSubscriber}
