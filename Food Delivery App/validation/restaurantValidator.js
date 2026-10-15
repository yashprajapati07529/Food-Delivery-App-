import {body} from 'express-validator';

const restaurantValidator = [
    body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    body("restaurantEmail").isEmail().withMessage("Invalid email address"),
    body("restaurantPhone").notEmpty().withMessage("Restaurant phone number is required"),
    body("restaurantAddress").notEmpty().withMessage("Restaurant address is required"),
    body("restaurantCity").notEmpty().withMessage("Restaurant city is required"),
    body("restaurantDescription").optional().isString().withMessage("Restaurant description must be a string"),
    body("restaurantImage").optional().isURL().withMessage("Restaurant image must be a valid URL"),
    body("restaurantRating").optional().isFloat({ min: 0, max: 5 }).withMessage("Restaurant rating must be between 0 and 5"),
    body("restaurantIsActive").isBoolean().withMessage("Restaurant active status must be a boolean value")
]

export default restaurantValidator;