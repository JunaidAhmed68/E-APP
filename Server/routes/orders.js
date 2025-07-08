// backend/routes/orders.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 🛒 Place a new order
router.post("/", async (req, res) => {
  const { userId, items, total, address } = req.body;

  if (!userId || !items || items.length === 0 || !total || !address) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    const order = new Order({
      userId,
      items: items.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })),
      total,
      address,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 📦 Get orders by user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json({ orders });
  } catch (err) {
    console.error("Fetching orders failed:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

export default router;
