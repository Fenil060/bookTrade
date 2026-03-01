import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    condition: {
      type: String,
      enum: ["new", "good", "fair", "poor"],
      required: true
    },

    images: {
      type: [String],
      validate: [arr => arr.length <= 3, "Max 3 images allowed"]
    },

    status: {
      type: String,
      enum: ["available", "requested", "approved", "sold"],
      default: "available"
    },

    activeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null
    }
  },
  { timestamps: true }
);

bookSchema.index = ({title: 1, author: 1});
export default mongoose.model("Book", bookSchema);
