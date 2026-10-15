import {body} from 'express-validator';

const orderValidator = [
    body("orderCustomerId").notEmpty().withMessage("Order customer ID is required"),
    body("orderRestaurantId").notEmpty().withMessage("Order restaurant ID is required"),
    body("orderFoodItems").isArray({ min: 1 }).withMessage("Order food items must be an array with at least one item"),
    body("orderFoodItems.*.foodId").notEmpty().withMessage("Order food item ID is required"),
    body("orderFoodItems.*.quantity").isInt({ min: 1 }).withMessage("Order food item quantity must be a positive integer"),
    body("orderFoodItems.*.price").isFloat({ min: 0 }).withMessage("Order food item price must be a positive number"),
    body("orderTotalAmount").isFloat({ min: 0 }).withMessage("Order total amount must be a positive number"),
    body("orderStatus").isIn(["placed", "preparing", "out_for_delivery", "delivered", "cancelled"]).withMessage("Invalid order status"),
    body("orderDeliveryAddress").notEmpty().withMessage("Order delivery address is required"),
    body("orderPaymentMethod").isIn(["cash", "card", "upi"]).withMessage("Invalid order payment method"),
]

export default orderValidator;