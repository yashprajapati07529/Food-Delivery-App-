
import express from "express";

import {
  addFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from "../controllers/foodControllers.js";

const router = express.Router();

// Add food item
router.post("/", addFood);

// Get all food items
router.get("/", getFoods);

// Get single food item
router.get("/:id", getFoodById);

// Update food item
router.put("/:id", updateFood);

// Delete food item
router.delete("/:id", deleteFood);

export default router;
