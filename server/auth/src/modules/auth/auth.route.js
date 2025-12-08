const express = require("express")
const { signupValidator, signinValidator } = require("../../middleware/validator.middleware")
const { register, login } = require("./auth.controller")
const router = express.Router()

router.post("/signup" , signupValidator , register)
router.post("/signin" , signinValidator , login)

module.exports  = router