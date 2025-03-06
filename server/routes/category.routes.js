const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get("/get/:id", categoryController.getSingleCategory);
router.post("/add", categoryController.addCategory);
router.post("/add-all", categoryController.addAllCategory);
router.get("/all", categoryController.getAllCategory);
router.get("/show/:type", categoryController.getProductTypeCategory);
router.get("/show", categoryController.getShowCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
router.put("/edit/:id", categoryController.updateCategory);
module.exports = router;
