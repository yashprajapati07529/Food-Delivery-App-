import { body } from "express-validator";

const foodValidator = [
  body("restaurantId").isMongoId().withMessage("A valid restaurant is required"),
  body("title").trim().notEmpty().withMessage("Food title is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
  body("image").optional({ values: "falsy" }).isURL().withMessage("Image must be a valid URL"),
  body("isAvailable").optional().isBoolean().withMessage("Availability must be a boolean value"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
];

export default foodValidator;