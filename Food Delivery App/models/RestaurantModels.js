import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },

        ownerName: { type: String, required: true },

        email: { type: String, required: true, unique: true, lowercase: true },

        phone: { type: String, required: true },

        address: { type: String, required: true },

        city: { type: String, required: true },

        description: { type: String, default: "" },

        image: { type: String, default: "" },

        rating: { type: Number, default: 0, min: 0, max: 5 },

        isActive: { type: Boolean, default: true },
    }, { timestamps: true, }
);

export default mongoose.model("Restaurant", restaurantSchema)