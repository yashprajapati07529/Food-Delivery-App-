import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    phone: { type: String, required: true },

    vehicleNumber: { type: String, required: true },

    vehicleType: { type: String, enum: ["bike", "scooter", "car"], required: true },

    licenseNumber: { type: String, required: true },

    profileImage: { type: String, default: "" },

    isActive: { type: Boolean, default: true },

    currentLocation: {
      latitude: { type: Number, default: 0 },

      longitude: { type: Number, default: 0 },
    },
  },
  { timestamps: true, }
);

const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);

export default DeliveryPartner;