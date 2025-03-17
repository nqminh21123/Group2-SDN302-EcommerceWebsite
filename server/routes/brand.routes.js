const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brand.controller');

// get all brands
router.get('/all', brandController.getAllBrands);
// add a brand
router.post('/add', brandController.addBrand);
// update a brand
router.put('/update/:id', brandController.updateBrand);
// delete a brand
router.delete('/delete/:id', brandController.deleteBrand);
// get a brand by id
router.get('/:id', brandController.getBrandById);
// get Active Brands
router.get('/active',brandController.getActiveBrands);

module.exports = router;