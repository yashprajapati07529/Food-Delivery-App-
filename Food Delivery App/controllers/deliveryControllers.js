
import DeliveryPartner from "../models/DeliveryPartnerModels.js";
import mongoose from "mongoose";

// 1. REGISTER DELIVERY PARTNER
export const registerPartner = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      vehicleNumber,
      vehicleType,
      licenseNumber,
      profileImage,
      isActive,
      currentLocation,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !vehicleNumber ||
      !vehicleType ||
      !licenseNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required delivery partner fields",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingPartner = await DeliveryPartner.findOne({
      $or: [
        { email: normalizedEmail },
        { vehicleNumber: vehicleNumber.trim() },
        { licenseNumber: licenseNumber.trim() },
      ],
    });

    if (existingPartner) {
      return res.status(409).json({
        success: false,
        message: "Email, vehicle number or license number already exists",
      });
    }

    const partner = await DeliveryPartner.create({
      name,
      email: normalizedEmail,
      phone,
      vehicleNumber: vehicleNumber.trim(),
      vehicleType,
      licenseNumber: licenseNumber.trim(),
      profileImage,
      isActive,
      currentLocation,
    });

    return res.status(201).json({
      success: true,
      message: "Delivery partner registered successfully",
      partner,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Delivery partner details already exist",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. GET ALL DELIVERY PARTNERS + SEARCH + PAGINATION
export const getPartners = async (req, res) => {
  try {
    const {
      search,
      isActive,
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
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        {
          vehicleNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (isActive !== undefined) {
      if (!["true", "false"].includes(isActive)) {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
      }

      filter.isActive = isActive === "true";
    }

    const [partners, total] = await Promise.all([
      DeliveryPartner.find(filter)
        .select("-licenseNumber")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      DeliveryPartner.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      partners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. GET SINGLE DELIVERY PARTNER
export const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery partner ID",
      });
    }

    const partner = await DeliveryPartner.findById(id)
      .select("-licenseNumber");

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    return res.status(200).json({
      success: true,
      partner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. UPDATE DELIVERY PARTNER
export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery partner ID",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "vehicleNumber",
      "vehicleType",
      "licenseNumber",
      "profileImage",
      "isActive",
      "currentLocation",
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

    if (updates.vehicleNumber) {
      updates.vehicleNumber = updates.vehicleNumber.trim();
    }

    if (updates.licenseNumber) {
      updates.licenseNumber = updates.licenseNumber.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const partner = await DeliveryPartner.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-licenseNumber");

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery partner updated successfully",
      partner,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email, vehicle number or license number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. DELETE DELIVERY PARTNER
export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery partner ID",
      });
    }

    const partner = await DeliveryPartner.findByIdAndDelete(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery partner deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
