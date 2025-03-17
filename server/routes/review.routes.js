const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

router.post("/add", reviewController.addReview);
router.delete("/delete/:id", reviewController.deleteReviews);
module.exports = router;
