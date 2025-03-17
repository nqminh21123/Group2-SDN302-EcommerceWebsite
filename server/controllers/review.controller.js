const mongoose = require("mongoose");
const Review = require("../model/Review");
const Product = require("../model/Products");
const User = require("../model/User");
const Order = require("../model/Order");

const addReview = async (req, res, next) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    // Check if the user has already left a review for this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product." });
    }

    const checkPurchase = await Order.findOne({
      user: new mongoose.Types.ObjectId(userId),
      "cart._id": { $in: [productId] },
    });

    if (!checkPurchase) {
      return res
        .status(400)
        .json({ message: "Without purchase you can not give here review!" });
    }

    // Create the new review
    const review = await Review.create(req.body);

    // Add the review to the product's reviews array
    const product = await Product.findById(productId);
    product.reviews.push(review._id);
    await product.save();

    // Add the review to the user's reviews array
    const user = await User.findById(userId);
    user.reviews.push(review._id);
    await user.save();

    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteReviews = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const result = await Review.deleteMany({ productId: productId });
    console.log(result);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product reviews not found" });
    }
    res.json({ message: "All reviews deleted for the product" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addReview,
  deleteReviews,
};
