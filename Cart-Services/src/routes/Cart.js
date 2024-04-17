const express = require("express");
const {
  addToCart,
  checkoutfromcart,
} = require("../controllers/Cart");

const router = express.Router();

router.post("/add-to-cart", addToCart);
router.post("/checkout/:userId", checkoutfromcart);

module.exports = router;