import { body } from "express-validator";

const orderValidator = [
  body("customerId").isMongoId().withMessage("A valid customer is required"),
  body("restaurantId").isMongoId().withMessage("A valid restaurant is required"),
  body("foodItems").isArray({ min: 1 }).withMessage("Select a food item"),
  body("foodItems.*.foodId").isMongoId().withMessage("A valid food item is required"),
  body("foodItems.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("deliveryAddress").trim().notEmpty().withMessage("Delivery address is required"),
  body("paymentMethod").optional().isIn(["cash", "card", "upi"]).withMessage("Invalid payment method"),
];

export default orderValidator;