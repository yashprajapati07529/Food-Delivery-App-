import {body} from 'express-validator';

const customerValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("profileImage").optional().isURL().withMessage("Profile image must be a valid URL")
]

export default customerValidator;