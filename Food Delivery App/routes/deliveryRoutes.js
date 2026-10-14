
import express from "express";

import {
  registerPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
} from "../controllers/deliveryControllers.js";

const router = express.Router();

// Register delivery partner
router.post("/", registerPartner);

// Get all delivery partners
router.get("/", getPartners);

// Get single delivery partner
router.get("/:id", getPartnerById);

// Update delivery partner
router.put("/:id", updatePartner);

// Delete delivery partner
router.delete("/:id", deletePartner);

export default router;
