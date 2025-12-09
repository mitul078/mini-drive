const Folder = require("./folder.model")

exports.createFolder = async (req, res) => {
    try {

        const { folderName, parentFolderId } = req.body
        const userId = req.user.id

        if(!folderName || !parentFolderId)
            return res.status(400).json({msg: "invalid inputs"})

        const checkParent = await Folder.findOne({
            _id: parentFolderId,
            userId
        })

        if(!checkParent) 
            return res.status(400).json({msg: "Parent not found"})

        const path = checkParent.path === "/" ? `/${folderName}` : `${checkParent.path}/${folderName}`

        const folder = await Folder.create({
            path,
            userId,
            folderName,
            parentFolderId,
        })

        res.status(201).json({msg: "Folder created" , folder})


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

