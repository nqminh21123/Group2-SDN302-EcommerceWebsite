const express = require('express');

const orderController = require('../controllers/order.controller');

const router = express.Router();

// get all orders
router.get('/all', orderController.getOrders);
// get order by id
router.get('/:id', orderController.getOrderById);
// add an order
router.post('/add', orderController.addOrder);
// update an order
router.put('/update/:id', orderController.updateOrder);
// delete an order
router.delete('/delete/:id', orderController.deleteOrder);
// create payment intent
router.post('/create-payment-intent', orderController.createPaymentIntent);


module.exports = router;