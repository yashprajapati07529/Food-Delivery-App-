import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },

        foodItems: [
            {
                foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },

                quantity: { type: Number, required: true, min: 1 },

                price: { type: Number, required: true, min: 0 },
            },
        ],

        totalAmount: { type: Number, required: true, min: 0 },

        status: {
            type: String,
            enum: [
                "placed",
                "preparing",
                "out_for_delivery",
                "delivered",
                "cancelled",
            ],
            default: "placed",
        },

        deliveryAddress: { type: String, required: true },

        paymentMethod: { type: String, enum: ["cash", "card", "upi"], default: "cash" },
    },
    { timestamps: true, }
);

export default mongoose.model("Order", orderSchema);