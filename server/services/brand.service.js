const Brand = require("../model/Brand");
const ApiError = require("../errors/api-error");

// get all brands
exports.getAllBrandsService = async (data) => {
  await Brand.deleteMany();
  const brand = await Brand.insertMany(data);
  return brand;
};

// add a brand
module.exports.addBrandService = async (data) => {
  const brand = await Brand.create(data);
  return brand;
};

// update a brand
exports.updateBrandService = async (id) => {
  const isExist = await Brand.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(404, "Brand not found");
  }
  const brand = await Brand.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return brand;
};

// delete a brand
exports.deleteBrandService = async (id) => {
  const brand = await Brand.findByIdAndDelete({ _id: id });
  return brand;
};
