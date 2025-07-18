import express from "express";
import Product from "../models/Product.js";

const router = express.Router();
// ✅ Get all products or only featured
// GET /api/products?featured=true&page=1&limit=10
router.get("/", async (req, res) => {
  try {
    const { featured, page = 1, limit = 12 } = req.query;
    const filter = featured === "true" ? { featured: true } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(parseInt(limit));

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalProducts: total,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// ✅ Get all categories
router.get("/categories", async (req, res) => {
  try {
    const Categories = await Product.distinct("category");

    // Convert to lowercase and remove duplicates
    const categories = [...new Set(Categories.map(cat => cat.toLowerCase().trim()))];

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


// ✅ Get products by category (Fix applied here!)
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products }); // ✅ wrap in an object
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

// ✅ Get product by ID (optional improvement to use "id" field if not _id)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }); // if using custom id
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json( {product });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ✅ Create a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create product" });
  }
});





export default router;
