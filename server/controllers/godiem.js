const Category = require('../model/Category.js')
const Product = require('../model/Products.js')
const Coupon = require('../model/Coupon');

const listProductsByRating =  async(rq,rs) =>{
    const { from, to } = rq.body;

    if (from === undefined || to === undefined || from > to) {
        return rs.status(400).json({ message: "Invalid 'from' and 'to' values" });
      }
    try {
        const listProduct = await Product.find().populate({
            path:'reviews',
            match: { rating: { $gte: from, $lte: to } }
        })
        const filteredProducts = listProduct.filter(
            (product) => product.reviews && product.reviews.length > 0
          );
        return rs.json(
            filteredProducts
          );
    } catch (error) {
        return response.status(500).json({message: error.message})
    }
 }

 const getAllProductByDiscount = async (req, res) => {
    const {discount} = req.body
    if (!discount || isNaN(discount)) {
        return res.status(400).json({ message: "Invalid discount value" });
      }
   try {
    const coupons = await Coupon.find({
      discountPercentage: { $gte: discount }
    })

    if (coupons.length == 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào phù hợp." });
    }

    const couponProductTypes = [
      ...new Set(coupons.map((coupon) => coupon.productType)),
    ];

    const products = await Product.find({
      productType: { $in: couponProductTypes },
    });
    return res.json(products);
   } catch (error) {
     return res.status(500).json({ message: error.message })
   }
 };


const listCountCategory = async (rq,rs) =>{
    try {
        const listcategory = await Category.find({status: 'Show'})
        const listConut = listcategory.map((category)=>({
            id : category._id,
            nameCate: category.productType,
            count: category.products.length,
        }))
        return rs.json(
            listConut.map((item) => ({
              "ID": item.id,
              "Tên Category": item.nameCate,
              "Số Lượng": item.count,
            }))
          );
          
    } catch (error) {
        return response.status(500).json({message: error.message})
    }
}

module.exports = {listCountCategory,listProductsByRating,getAllProductByDiscount};