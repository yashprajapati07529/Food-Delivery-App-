
import express from "express";

import {
  registerCustomer,
  loginCustomer,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/customerControllers.js";

import customerValidator from"../validators/customerValidator.js";

const router = express.Router();

// Register customer
router.post("/register", customerValidator, registerCustomer);

// Login customer
router.post("/login", loginCustomer);

// Get logged-in customer profile
router.get("/profile", authMiddleware, getProfile);

// Update customer profile
router.put("/:id", authMiddleware, updateProfile);

// Delete customer profile
router.delete("/:id", authMiddleware, deleteProfile);

export default router;
