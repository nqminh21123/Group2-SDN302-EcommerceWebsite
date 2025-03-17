const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");

exports.getOrders = async (req, res, next) => {
    try {
        const orderItems = await Order.find({}).populate("user");
        res.status(200).json({
            success: true,
            orderItems,
        });
    }catch(err){
        console.log(err);
        next(err);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user");
        res.status(200).json({
            success: true,
            order,
        });
    }catch(err){
        console.log(err);
        next(err);
    }
};

exports.addOrder = async (req, res, next) => {
    try{
        const order = await Order.create(req.body);
        res.status(200).json({success: true, message: "Order added successfully", order: order});
    }catch(err){
        console.log(err);
        next(err);
    }
};

exports.updateOrder = async (req, res, next) => {
    try{
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({success: true, message: "Order updated successfully", order: order});
    }catch(err){
        console.log(err);
        next(err);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({success: true, message: "Order deleted successfully"});
    }catch(err){
        console.log(err);
        next(err);
    }
};

exports.createPaymentIntent = async (req, res, next) => {
    try{
        const product = req.body;
        const price = Number(product.price) * 100;
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "usd",
            amount: price,
            payment_method_types: ["card"],
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }catch(err){
        console.log(err);
        next(err);
    }
};
