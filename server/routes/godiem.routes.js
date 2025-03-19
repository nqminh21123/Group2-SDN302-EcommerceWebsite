const express = require('express');
const router = express.Router();
// internal
const {listCountCategory,listProductsByRating,getAllProductByDiscount} = require('../controllers/godiem.js');

// Get all godiems
 router.get('/', listCountCategory);
 router.get('/productbyrating', listProductsByRating);
 router.get('/productdiscount', getAllProductByDiscount);
 
module.exports = router;