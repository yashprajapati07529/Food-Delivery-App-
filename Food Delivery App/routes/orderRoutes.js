
import express from "express";

import {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderControllers.js";

const router = express.Router();

// Place new order
router.post("/", placeOrder);

// Get all orders or filter by customer
router.get("/", getOrders);

// Get single order
router.get("/:id", getOrderById);

// Update order status
router.put("/:id", updateOrderStatus);

// Cancel order
router.delete("/:id", cancelOrder);

export default router;
