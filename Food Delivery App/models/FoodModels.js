import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true, },

        title: { type: String, required: true, trim: true },

        description: { type: String, default: "" },

        price: { type: Number, required: true, min: 0 },

        image: { type: String, default: "" },

        isAvailable: { type: Boolean, default: true },

        rating: { type: Number, default: 0, min: 0, max: 5 },
    },
    { timestamps: true, }
);

export default mongoose.model("Food", foodSchema);