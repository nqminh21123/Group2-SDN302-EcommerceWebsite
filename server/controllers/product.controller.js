const productServices = require('../services/product.service.js');
const Product = require('../model/Products.js')

//all product
const getAllProduct = async (req, res, next) => {
    try {
        const result = await productServices.getAllProductsService();
        res.status(200).json({
            success: true,
            result,
        })
    } catch (error) {
        next(error);
    }
};

//one product
const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await productServices.getProductByIdService(id);
        res.status(200).json({
            success: true,
            product,
        })
    } catch (error) {
        next(error);
    }
}

//delete product
const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await productServices.deleteProduct(id);
        res.status(200).json({
            success: true,
            result,
        })
    } catch (error) {
        next(error);
    }
}

//update product
const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const productUpdate = req.body;
        const result = await productServices.updateProductService(id, productUpdate);
        res.status(200).json({
            success: true,
            result,
        })
    } catch (error) {
        next(error);
    }
}

const createProduct = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await productServices.createProductService(data);
        res.status(200).json({
            status: "success",
            message: "Product created successfully!",
            data: result,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const reviewsProducts = async (req, res, next) => {
    // try {
    //     const result = await productServices.getReviewsProducts();
    //     res.status(200).json({
    //         status: "success",
    //         data: result,
    //     });
    // } catch (error) {
    //     console.log(error);
    //     next(error);
    // }
}

module.exports = {
    getAllProduct,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    reviewsProducts,
};