const Brand = require("../model/Brand");
const Category = require("../model/Category");
const Product = require("../model/Products");
const Reviews = require("../model/Review");

// create product service
exports.createProductService = async (data) => {
  const product = await Product.create(data);
  const { _id: productId, brand, category } = product;
  //update Brand
  await Brand.updateOne({ _id: brand.id }, { $push: { products: productId } });
  //Category Brand
  await Category.updateOne(
    { _id: category.id },
    { $push: { products: productId } }
  );
  return product;
};

// create all product service
exports.addAllProductService = async (data) => {
  const products = await Product.insertMany(data);
  for (const product of products) {
    await Brand.findByIdAndUpdate(product.brand.id, {
      $push: { products: product._id },
    });
    await Category.findByIdAndUpdate(product.category.id, {
      $push: { products: product._id },
    });
  }
  return products;
};

// get product data
exports.getAllProductsService = async () => {
  const products = await Product.find().populate("reviews");
  return products;
};

exports.getProductByIdService = async (id) => {
  const products = await Product.findById(id);
  return products;
};

// get type of product service
exports.getProductTypeService = async (req) => {
  const type = req.params.type;
  const query = req.query;
  let products;
  if (query.new === "true") {
    products = await Product.find({ productType: type })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("reviews");
  } else if (query.featured === "true") {
    products = await Product.find({
      productType: type,
      featured: true,
    }).populate("reviews");
  } else if (query.topSellers === "true") {
    products = await Product.find({ productType: type })
      .sort({ sellCount: -1 })
      .limit(8)
      .populate("reviews");
  } else {
    products = await Product.find({ productType: type }).populate("reviews");
  }
  return products;
};

// get offer product service
exports.getOfferTimerProductService = async (query) => {
  const products = await Product.find({
    productType: query,
    "offerDate.endDate": { $gt: new Date() },
  }).populate("reviews");
  return products;
};

// get popular product service by type
exports.getPopularProductServiceByType = async (type) => {
  const products = await Product.find({ productType: type })
    .sort({ "reviews.length": -1 })
    .limit(8)
    .populate("reviews");
  return products;
};

exports.getTopRatedProductService = async () => {
  const products = await Product.find({
    reviews: { $exists: true, $ne: [] },
  }).populate("reviews");

  const topRatedProducts = products.map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / product.reviews.length;

    return {
      ...product.toObject(),
      rating: averageRating,
    };
  });

  topRatedProducts.sort((a, b) => b.rating - a.rating);

  return topRatedProducts;
};

// get product data
exports.getRelatedProductService = async (productId) => {
  const currentProduct = await Product.findById(productId);

  const relatedProducts = await Product.find({
    "category.name": currentProduct.category.name,
    _id: { $ne: productId }, // Exclude the current product ID
  });
  return relatedProducts;
};

// get Reviews Products
exports.getStockOutProducts = async () => {
  const result = await Product.find({ status: "out-of-stock" }).sort({
    createdAt: -1,
  });
  return result;
};

// delete product
exports.deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

//update product
exports.updateProductService = async (id, payload) => {
  const isExist = await Product.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(404, "Category not found !");
  }

  const result = await Product.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// get Reviews Products
exports.getReviewsProducts = async (id) => {
  const result = await Product.findById(id).populate("reviews");
  return result.reviews;
};

exports.getProductWithRating = async (from, to) => {
  const products = await Product.find()
    .populate({
      path: "reviews",
      match: { rating: { $gte: from, $lte: to } },
    })
    .select("_id sku title reviews");
  const filteredProducts = products.filter(
    (product) => product.reviews.length > 0
  );

  return filteredProducts;
};

exports.getProductWithCategoryShow = async (req, res) => {
  const listcategory = await Category.find({ status: "Show" });
  const listConut = listcategory.map((category) => ({
    id: category._id,
    nameCate: category.productType,
    count: category.products.length,
  }));
  return rs.json(
    listConut.map((item) => ({
      _id: item.id,
      Category: item.nameCate,
      Count: item.count,
    }))
  );
};
