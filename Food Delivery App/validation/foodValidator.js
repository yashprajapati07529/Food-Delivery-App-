import {body} from 'express-validator';

const foodValidator = [
    body("foodrestaurantid").notEmpty().withMessage("Food restaurant is required"),
    body("foodDescription").notEmpty().withMessage("Food description is required"),
    body("foodTitle").notEmpty().withMessage("Food title is required"),
    body("foodPrice").isFloat({ min: 0 }).withMessage("Food price must be a positive number"),
    body("foodImage").optional().isURL().withMessage("Food image must be a valid URL"),
    body("foodIsAvailable").isBoolean().withMessage("Food availability must be a boolean value"),
    body("foodRating").optional().isFloat({ min: 0, max: 5 }).withMessage("Food rating must be between 0 and 5"),
]

export default foodValidator;