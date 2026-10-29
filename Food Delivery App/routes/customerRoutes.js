
import express from "express";

import {
  registerCustomer,
  loginCustomer,
  getProfile,
  updateProfile,
  deleteProfile,
  updateCustomerRecord,
  deleteCustomerRecord,
} from "../controllers/customerControllers.js";
import { body } from "express-validator";

import customerValidator from"../validation/customerValidator.js";
import validateRequest from "../validation/validateRequest.js";

const router = express.Router();

// Register customer
router.post("/register", customerValidator, validateRequest, registerCustomer);

// Login customer
router.post("/login", loginCustomer);

router.put(
  "/admin/:id",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("profileImage").optional({ values: "falsy" }).isURL().withMessage("Profile image must be a valid URL"),
  ],
  validateRequest,
  updateCustomerRecord
);
router.delete("/admin/:id", deleteCustomerRecord);

// Get logged-in customer profile
router.get("/profile", getProfile);

// Update customer profile
router.put("/:id", updateProfile);

// Delete customer profile
router.delete("/:id", deleteProfile);

export default router;
