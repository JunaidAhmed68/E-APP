import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  brand: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: [String],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });


export default mongoose.model("Product", productSchema);
