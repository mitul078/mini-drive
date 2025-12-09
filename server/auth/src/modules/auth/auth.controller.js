const User = require("./auth.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { publishUserCreate } = require("../../events/auth.publisher")


exports.register = async (req, res) => {
    try {

        const { username, email, password, name } = req.body

        const findUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (findUser) {
            return res.status(400).json({
                msg: findUser.username === username ? "Username already taken." : "User already exists"
            })
        }

        const hashPass = await bcrypt.hash(password, 10)

        const user = await User.create({
            username, email, name, password: hashPass
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        await publishUserCreate(user)

        res.status(201).json({
            msg: "Register success",
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user)
            return res.status(404).json({ msg: "User not found." })

        const checkPass = await bcrypt.compare(password, user.password)
        if (!checkPass)
            return res.status(400).json({ msg: "Password invalid" })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            msg: "Login success",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
                role: user.role
            }
        })


    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}