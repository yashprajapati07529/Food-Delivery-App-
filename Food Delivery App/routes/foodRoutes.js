
import express from "express";

import {
  addFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from "../controllers/foodControllers.js";

import foodValidator from "../validation/foodValidator.js";

const router = express.Router();

// Add food item
router.post("/", foodValidator, addFood);

// Get all food items
router.get("/", getFoods);

// Get single food item
router.get("/:id", getFoodById);

// Update food item
router.put("/:id", foodValidator, updateFood);

// Delete food item
router.delete("/:id", foodValidator, deleteFood);

export default router;
