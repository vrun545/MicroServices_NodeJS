const express = require("express");
const {
  getProductDetailsFromInventory,
  getProductDetails,
  getAllProducts,
  getProductById,
  createProductController,
  deleteProductController,
  productUpdateController,
} = require("../controllers/Product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/getall", getAllProducts);
router.get("/get/:id", getProductById);
router.post("/create", createProductController);
router.put("/update/:id", productUpdateController);
router.delete("/delete/:id", deleteProductController);
router.get("/product-details/:productId", getProductDetails);
router.get(
  "/product-details-inventory/:productId",
  getProductDetailsFromInventory
);


module.exports = router;