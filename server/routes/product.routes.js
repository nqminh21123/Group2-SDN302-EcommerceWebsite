const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');

router.get('/all', productController.getAllProduct);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);
router.put('/edit/:id', productController.updateProduct);
router.post('/add', productController.createProduct);
router.get('/reviews', productController.reviewsProducts);

module.exports = router;
