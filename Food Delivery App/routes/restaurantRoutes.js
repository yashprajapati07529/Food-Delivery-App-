
import express from "express";

import {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantControllers.js";

import restaurantValidator from "../validation/restaurantValidator.js";

const router = express.Router();

// Add restaurant
router.post("/", restaurantValidator, addRestaurant);

// Get all restaurants, with search and pagination
router.get("/", getRestaurants);

// Get single restaurant
router.get("/:id", getRestaurantById);

// Update restaurant
router.put("/:id", restaurantValidator, updateRestaurant);

// Delete restaurant
router.delete("/:id", restaurantValidator, deleteRestaurant);

export default router;
