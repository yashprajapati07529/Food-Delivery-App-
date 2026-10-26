
import express from "express";

import {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderControllers.js";

import orderValidator from "../validation/orderValidator.js";

const router = express.Router();

// Place new order
router.post("/", orderValidator, placeOrder);

// Get all orders or filter by customer
router.get("/", getOrders);

// Get single order
router.get("/:id", getOrderById);

// Update order status
router.put("/:id", orderValidator, updateOrderStatus);

// Cancel order
router.delete("/:id", orderValidator, cancelOrder);

export default router;
