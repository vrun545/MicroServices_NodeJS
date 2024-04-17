const cartModel = require("../models/Cart");
const axios = require("axios");

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({ userId, products: [] });
    }
    const existingProduct = cart.products.find(
      (item) => item.productId === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Product added to cart successfully",
      cart
    });
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).send({
      success: false,
      message: "Error in Cart-Add API",
      err,
    });
  }
};

const checkoutfromcart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    if (!cart.products || cart.products.length === 0) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }
    // let initalQuantity = cart.products.reduce(
    //   (total, product) => total + product.quantity,
    //   0
    // );
    // var pid = cart.products[0].productId;
    // let itemQuantityinCart = await axios.get(
    //   `http://localhost:8082/api/inventory/get-quantity/${pid}`
    // );
    // const Originalquantity = itemQuantityinCart.data.quantity;
    // if (initalQuantity > Originalquantity) {
    //   return res
    //     .status(500)
    //     .json({
    //       success: false,
    //       message: "Not Enough Quantity we have of your selected product",
    //     });
    // }
    cart.products = [];
    await cart.save();
    res.status(200).json({ success: true, message: "Checkout successful" });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { addToCart, checkoutfromcart };
