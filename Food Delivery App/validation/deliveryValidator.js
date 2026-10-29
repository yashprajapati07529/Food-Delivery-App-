import { body } from "express-validator";

const deliveryValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("vehicleNumber").trim().notEmpty().withMessage("Vehicle number is required"),
  body("vehicleType").isIn(["bike", "scooter", "car"]).withMessage("Invalid vehicle type"),
  body("licenseNumber").trim().notEmpty().withMessage("License number is required"),
  body("profileImage").optional({ values: "falsy" }).isURL().withMessage("Profile image must be a valid URL"),
];

export const deliveryUpdateValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("phone").optional().trim().notEmpty().withMessage("Phone number cannot be empty"),
  body("vehicleNumber").optional().trim().notEmpty().withMessage("Vehicle number cannot be empty"),
  body("vehicleType").optional().isIn(["bike", "scooter", "car"]).withMessage("Invalid vehicle type"),
  body("licenseNumber").optional().trim().notEmpty().withMessage("License number cannot be empty"),
  body("isActive").optional().isBoolean().withMessage("Active status must be a boolean value"),
  body("profileImage").optional({ values: "falsy" }).isURL().withMessage("Profile image must be a valid URL"),
];

export default deliveryValidator;