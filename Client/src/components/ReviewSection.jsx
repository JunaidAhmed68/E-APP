// import React, { useState } from "react";
// import { TextField, Button } from "@mui/material";
// import { FaStar } from "react-icons/fa";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// const ReviewForm = ({ productId, existingReview, refreshReviews }) => {
//   const [rating, setRating] = useState(existingReview?.rating || 0);
//   const [comment, setComment] = useState(existingReview?.comment || "");
//   const [images, setImages] = useState([]);
//   const [imagePreview, setImagePreview] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length > 4) {
//       toast.warning("You can upload a maximum of 4 images.");
//       return;
//     }

//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreview(previews);

//     const uploaded = [];
//     for (const file of files) {
//       const data = new FormData();
//       data.append("file", file);
//       data.append("upload_preset", "ecommerce_unsigned");
//       data.append("cloud_name", "dbqf9udic");

//       try {
//         const res = await axios.post(
//           "https://api.cloudinary.com/v1_1/dbqf9udic/image/upload",
//           data
//         );
//         uploaded.push(res.data.secure_url);
//       } catch (err) {
//         toast.error("Image upload failed");
//       }
//     }

//     setImages(uploaded);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!rating && !comment && images.length === 0) {
//       toast.warn("Please add a rating, comment, or image.");
//       return;
//     }

//     setIsSubmitting(true);
//     const token =  Cookies.get("token");

//     const payload = {
//       productId,
//       rating,
//       comment,
//       images,
//     };

//     try {
//       if (existingReview) {
//         await axios.put(`http://localhost:3000/review/${existingReview._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success("Review updated successfully.");
//       } else {
//         await axios.post(`http://localhost:3000/review`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success("Review submitted successfully.");
//       }

//       refreshReviews();
//       setRating(0);
//       setComment("");
//       setImages([]);
//       setImagePreview([]);
//     } catch (err) {
//       toast.error("Error submitting review.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//       {/* Rating */}
//       <div className="flex gap-1">
//         {[1, 2, 3, 4, 5].map((val) => (
//           <FaStar
//             key={val}
//             size={24}
//             className={`cursor-pointer ${
//               val <= rating ? "text-yellow-500" : "text-gray-300"
//             }`}
//             onClick={() => setRating(val)}
//           />
//         ))}
//       </div>

//       {/* Comment */}
//       <TextField
//         label="Write your comment (optional)"
//         multiline
//         fullWidth
//         rows={3}
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//       />

//       {/* Images */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Upload Review Images (Max 4)
//         </label>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageUpload}
//         />
//         <div className="flex gap-2 mt-2 flex-wrap">
//           {imagePreview.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`Preview ${i}`}
//               className="w-20 h-20 object-cover rounded border"
//             />
//           ))}
//         </div>
//       </div>

//       {/* Submit Button */}
//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         disabled={isSubmitting}
//       >
//         {existingReview ? "Update Review" : "Submit Review"}
//       </Button>
//     </form>
//   );
// };

// export default ReviewForm;
