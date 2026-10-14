
import Restaurant from "../models/RestaurantModels.js";
import mongoose from "mongoose";

// 1. ADD RESTAURANT
export const addRestaurant = async (req, res) => {
  try {
    const {
      name,
      ownerName,
      email,
      phone,
      address,
      city,
      description,
      image,
      rating,
      isActive,
    } = req.body;

    if (!name || !ownerName || !email || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required restaurant fields",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingRestaurant = await Restaurant.findOne({
      email: normalizedEmail,
    });

    if (existingRestaurant) {
      return res.status(409).json({
        success: false,
        message: "Restaurant email already exists",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      ownerName,
      email: normalizedEmail,
      phone,
      address,
      city,
      description,
      image,
      rating,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      restaurant,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Restaurant email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. GET ALL RESTAURANTS + SEARCH + SORT + PAGINATION
export const getRestaurants = async (req, res) => {
  try {
    const {
      search,
      city,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(
      100,
      Math.max(1, Number(limit) || 10)
    );

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
      ];
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      rating: { rating: -1 },
      name: { name: 1 },
    };

    const sortBy = sortOptions[sort] || sortOptions.newest;

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter)
        .sort(sortBy)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Restaurant.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. GET SINGLE RESTAURANT
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. UPDATE RESTAURANT
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const allowedFields = [
      "name",
      "ownerName",
      "email",
      "phone",
      "address",
      "city",
      "description",
      "image",
      "rating",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.email) {
      updates.email = updates.email.trim().toLowerCase();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Restaurant email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. DELETE RESTAURANT
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findByIdAndDelete(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
