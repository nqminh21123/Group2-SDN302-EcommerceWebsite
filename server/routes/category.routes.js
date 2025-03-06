const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

const categoryRouter = express.Router();
categoryRouter.post("/create", categoryController.createCategory);
categoryRouter.get("/all", categoryController.getAllCategories);
categoryRouter.get("/:id", categoryController.getCategoryById);
categoryRouter.put("/update/:id", categoryController.updateCategory);
categoryRouter.delete("/delete/:id", categoryController.deleteCategory);
categoryRouter.get("/parent/:id", categoryController.getCategoryByParent);
categoryRouter.put("/add-product/:id", categoryController.addProductToCategory);
categoryRouter.put(
  "/remove-product/:id",
  categoryController.removeProductFromCategory
);
categoryRouter.put(
  "/update-status/:id",
  categoryController.updateCategoryStatus
);
