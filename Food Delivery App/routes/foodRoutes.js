
import express from "express";

import {
  addFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from "../controllers/foodControllers.js";

import foodValidator from "../validation/foodValidator.js";
import validateRequest from "../validation/validateRequest.js";

const router = express.Router();

// Add food item
router.post("/", foodValidator, validateRequest, addFood);

// Get all food items
router.get("/", getFoods);

// Get single food item
router.get("/:id", getFoodById);

// Update food item
router.put("/:id", foodValidator, validateRequest, updateFood);

// Delete food item
router.delete("/:id", deleteFood);

export default router;
