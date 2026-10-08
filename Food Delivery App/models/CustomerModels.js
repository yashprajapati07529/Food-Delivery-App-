import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },

        email: { type: String, required: true, trim: true, unique: true, lowercase: true },

        password: { type: String, required: true, minlength: 6, select: false },

        phone: { type: String, required: true },

        address: { type: String, required: true },

        city: { type: String, required: true, trim: true },

        profileImage: { type: String, default: "" }

    }, { timestamps: true }
)

export default mongoose.model("Customer", customerSchema)