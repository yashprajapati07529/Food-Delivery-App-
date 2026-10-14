
import Order from "../models/OrderModels.js";
import Food from "../models/FoodModels.js";
import Customer from "../models/CustomerModels.js";
import Restaurant from "../models/RestaurantModels.js";
import mongoose from "mongoose";

const allowedStatuses = [
  "placed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

// 1. PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const {
      customerId,
      restaurantId,
      foodItems,
      deliveryAddress,
      paymentMethod = "cash",
    } = req.body;

    if (
      !customerId ||
      !restaurantId ||
      !deliveryAddress ||
      !Array.isArray(foodItems) ||
      foodItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer, restaurant, food items and delivery address are required",
      });
    }

    if (
      !mongoose.isValidObjectId(customerId) ||
      !mongoose.isValidObjectId(restaurantId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer or restaurant ID",
      });
    }

    if (!["cash", "card", "upi"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const customer = await Customer.findById(customerId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or inactive",
      });
    }

    let totalAmount = 0;
    const finalFoodItems = [];

    for (const item of foodItems) {
      if (
        !mongoose.isValidObjectId(item.foodId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Each food item needs a valid ID and positive integer quantity",
        });
      }

      const food = await Food.findById(item.foodId);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food not found: ${item.foodId}`,
        });
      }

      if (!food.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${food.title} is currently unavailable`,
        });
      }

      if (food.restaurantId.toString() !== restaurantId) {
        return res.status(400).json({
          success: false,
          message: `${food.title} does not belong to the selected restaurant`,
        });
      }

      totalAmount += food.price * item.quantity;

      finalFoodItems.push({
        foodId: food._id,
        quantity: item.quantity,
        price: food.price,
      });
    }

    const order = await Order.create({
      customerId,
      restaurantId,
      foodItems: finalFoodItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: "placed",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. GET ORDERS
export const getOrders = async (req, res) => {
  try {
    const { customerId, status, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(
      100,
      Math.max(1, Number(limit) || 10)
    );

    const filter = {};

    if (customerId) {
      if (!mongoose.isValidObjectId(customerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid customer ID",
        });
      }

      filter.customerId = customerId;
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("customerId", "name email phone")
        .populate("restaurantId", "name city")
        .populate("foodItems.foodId", "title price image")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. GET SINGLE ORDER
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate("customerId", "name email phone")
      .populate("restaurantId", "name city")
      .populate("foodItems.foodId", "title price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.status === "delivered" ||
      order.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be updated",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
