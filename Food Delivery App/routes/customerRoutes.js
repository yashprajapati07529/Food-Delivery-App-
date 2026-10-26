
import express from "express";

import {
  registerCustomer,
  loginCustomer,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/customerControllers.js";

import customerValidator from"../validation/customerValidator.js";

const router = express.Router();

// Register customer
router.post("/register", customerValidator, registerCustomer);

// Login customer
router.post("/login", loginCustomer);

// Get logged-in customer profile
router.get("/profile", getProfile);

// Update customer profile
router.put("/:id", updateProfile);

// Delete customer profile
router.delete("/:id", deleteProfile);

export default router;
