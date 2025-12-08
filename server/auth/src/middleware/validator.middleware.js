const { body, validationResult } = require("express-validator");

exports.signupValidator = [
    body("name")
        .notEmpty().withMessage("Name is required"),
    body("email")
        .isEmail().withMessage("Enter valid email")
        .notEmpty().withMessage("Email is required"),
    body("username")
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 10 }).withMessage("Username must be 3-10 character")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters , numbers and underscore"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 5 }).withMessage("Password length is minimum 5 character")
        .matches(/[A-z]/).withMessage("Password must contain the at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain the at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain the at least one number")
        .matches(/[@]/).withMessage("Password must contain a one symbol.(@)"),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() })
        }
        next()
    }
]

exports.signinValidator = [
    body("email")
        .isEmail().withMessage("Enter valid email")
        .notEmpty().withMessage("Email is required"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 5 }).withMessage("Password length is minimum 5 character")
        .matches(/[A-z]/).withMessage("Password must contain the at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain the at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain the at least one number")
        .matches(/[@]/).withMessage("Password must contain a one symbol.(@)"),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() })
        }
        next()
    }
]