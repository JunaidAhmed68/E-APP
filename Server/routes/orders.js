import express from "express";
import Order from "../models/Order.js";
import User from "../models/user.js";

const router = express.Router();

// 🛒 Place a new order
router.post("/", async (req, res) => {
  const { userId, items, total, address, phoneNumber } = req.body;

  if (!userId || !items || items.length === 0 || !total || !address || !phoneNumber) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    const order = new Order({ userId, items, total, address, phoneNumber });
    
    await order.save();

    await User.findByIdAndUpdate(userId, {
      orderAddress: address,
      orderPhone: phoneNumber,
    }, { new: true });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});



// 📦 Get orders by user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Fetching orders failed:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

export default router;
