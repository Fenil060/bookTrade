import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "paid", "cancelled"],
      default: "pending"
    },

    paymentMode: {
      type: String,
      enum: ["offline", "online"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
