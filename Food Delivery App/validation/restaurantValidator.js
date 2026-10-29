import { body } from "express-validator";

const restaurantValidator = [
  body("name").trim().notEmpty().withMessage("Restaurant name is required"),
  body("ownerName").trim().notEmpty().withMessage("Owner name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("image").optional({ values: "falsy" }).isURL().withMessage("Image must be a valid URL"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
  body("isActive").optional().isBoolean().withMessage("Active status must be a boolean value"),
];

export default restaurantValidator;