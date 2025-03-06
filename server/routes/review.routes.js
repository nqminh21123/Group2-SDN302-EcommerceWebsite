const express = require("express");
const router = express.Router();
const { addReview, deleteReviews} = require("../controllers/review.controller");

// add a review
router.post("/add", addReview);
// delete reviews
router.delete("/delete/:id", deleteReviews);

module.exports = router;
