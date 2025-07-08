import User from "../models/user.js";
import express from "express";

const cartRouter = express.Router();

// PUT /cart/:id
cartRouter.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { cart } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { myCart: cart },
      { new: true }
    );

    res.status(200).json({ message: "Cart updated", cart: user.myCart });
  } catch (error) {
    res.status(500).json({ message: "Error saving cart" });
  }
});

// GET /cart/:id
cartRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ cart: user.myCart });
  } catch (error) {
    res.status(500).json({ message: "Error getting cart" });
  }
});

export default cartRouter;
