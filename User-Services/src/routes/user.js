const express = require("express");
const {
  getAllProductInInventory,
  updateProductInInventory,
  removeProductFromInventory,
  addProductToInventory,
  getUserProductDetails,
  RegisterController,
  loginController,
  addToCart,
  removeFromCart,
  checkoutfromcart,
} = require("../controllers/user");

const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/register", RegisterController);
router.post("/login", loginController);
router.get("/user-product-details/:productId", getUserProductDetails);
router.get("/getall-product", getAllProductInInventory);
router.post("/add-product", authMiddleware, addProductToInventory);
router.delete(
  "/remove-product/:id",
  authMiddleware,
  removeProductFromInventory
);

router.put("/update-product/:id", authMiddleware, updateProductInInventory);
router.post("/cart/add", addToCart);
router.delete("/cart/remove/:productId", removeFromCart);
router.post("/checkout/:id", checkoutfromcart);

module.exports = router;
