
import express from "express";

import {
  registerPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
} from "../controllers/deliveryControllers.js";

import deliveryValidator, { deliveryUpdateValidator } from "../validation/deliveryValidator.js";
import validateRequest from "../validation/validateRequest.js";

const router = express.Router();

// Register delivery partner
router.post("/", deliveryValidator, validateRequest, registerPartner);

// Get all delivery partners
router.get("/", getPartners);

// Get single delivery partner
router.get("/:id", getPartnerById);

// Update delivery partner
router.put("/:id", deliveryUpdateValidator, validateRequest, updatePartner);

// Delete delivery partner
router.delete("/:id", deletePartner);

export default router;
