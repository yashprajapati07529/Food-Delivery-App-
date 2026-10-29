import { body } from "express-validator";

const customerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("profileImage").optional({ values: "falsy" }).isURL().withMessage("Profile image must be a valid URL"),
];

export default customerValidator;