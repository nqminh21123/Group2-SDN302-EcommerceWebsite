const e = require('express');
const Brand = require('../model/Brand');
const brandService = require('../services/brand.service');

//get all brands
exports.getAllBrands = async (req, res) => {
    try{
        const brands = await Brand.find({},{name:1,email:1,logo:1,website:1,location:1});
        res.status(200).json({brands});
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

// add a brand
exports.addBrand = async (req, res) => {
   try{
        const brands = await brandService.addBrandService(req.body);
        res.status(201).json({brands});
   }catch(err){
        res.status(400).json({message: err.message});
   }
};

// update a brand
exports.updateBrand = async (req, res) => {
    try{
        const brands = await brandService.updateBrandService(req.params.id, req.body);
        res.status(200).json({brands});
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

exports.deleteBrand = async (req, res) => {
    try{
        await brandService.deleteBrandService(req.params.id);
        res.status(200).json({success:true ,message: "Brand deleted successfully"});
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

exports.getBrandById = async (req, res) => {
    try{
        const brands = await Brand.findById(req.params.id);
        res.status(200).json({brands});

    }catch(err){
        res.status(400).json({message: err.message});
    }
};

exports.getActiveBrands = async (req,res,next) => {
    try {
      const result = await brandService.getBrandsService();
      res.status(200).json({
        success:true,
        result,
      })
    } catch (error) {
      next(error)
    }
  }