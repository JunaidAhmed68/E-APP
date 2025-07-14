// import express from "express";
// import Review from "../models/Review.js";
// const router = express.Router();

// // GET: all reviews for a product
// router.get("/", async (req, res) => {
//   try {
//     const { productId } = req.query;
//     const reviews = await Review.find({ productId }).populate("userId", "username");
//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // POST: create review
// router.post("/", async (req, res) => {
//   try {
//     const { productId, rating, comment, images } = req.body;
//     const existing = await Review.findOne({ productId, userId: req.user.id });
//     if (existing) return res.status(400).json({ error: "Already reviewed." });

//     const review = new Review({
//       productId,
//       userId: req.user.id,
//       rating,
//       comment,
//       images,
//     });

//     await review.save();
//     res.status(201).json(review);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // PUT: update own review
// router.put("/:id", async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) return res.status(404).json({ error: "Review not found" });
//     if (review.userId.toString() !== req.user.id)
//       return res.status(403).json({ error: "Unauthorized" });

//     const { rating, comment, images } = req.body;

//     review.rating = rating ?? review.rating;
//     review.comment = comment ?? review.comment;
//     review.images = images ?? review.images;

//     await review.save();
//     res.json(review);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // DELETE: delete own review
// router.delete("/:id", async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);
//     if (!review) return res.status(404).json({ error: "Review not found" });
//     if (review.userId.toString() !== req.user.id)
//       return res.status(403).json({ error: "Unauthorized" });

//     await review.remove();
//     res.json({ message: "Review deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;
