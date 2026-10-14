
import express from "express";

import {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantControllers.js";

const router = express.Router();

// Add restaurant
router.post("/", addRestaurant);

// Get all restaurants, with search and pagination
router.get("/", getRestaurants);

// Get single restaurant
router.get("/:id", getRestaurantById);

// Update restaurant
router.put("/:id", updateRestaurant);

// Delete restaurant
router.delete("/:id", deleteRestaurant);

export default router;
