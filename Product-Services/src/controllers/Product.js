const axios = require("axios");
const Product = require("../models/Product");

const createProductController = async (req, res) => {
  try {
    const { name, price, size, design, quantity } = req.body;

    if (!name || !size || !price || !quantity || !design) {
      return res.status(500).send({
        success: false,
        message: "All Fields are Required",
      });
    }

    const newProduct = new Product({
      name,
      price,
      size,
      design,
      quantity,
    });

    await axios.post("http://localhost:8082/api/inventory/add", {
      productId: newProduct._id,
      quantity: req.body.quantity,
    });

    await newProduct.save();
    res.status(201).send({
      success: true,
      message: "New Item Created",
      newProduct
    });
  } catch (err) {
    console.log(err),
      res.status(500).send({
        success: false,
        message: "Error in Create Product API"
      });
  }
};

const productUpdateController = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(404).send({
        success: true,
        message: "Product not Found",
      });
    }
    const product = await Product.findByIdAndUpdate(productId);
    if (!product) {
      return res.status(404).send({
        success: true,
        message: "Product not Found",
      });
    }
    const { name, price, size, design } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        size,
        design,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Product-Item is Updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Update-Product API",
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(404).send({
        success: false,
        message: "ProductID is Missing",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not Available",
      });
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).send({
      success: true,
      message: "Item is Deleted.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Delete-Product API",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getProductDetailsFromInventory = async (req, res) => {
  try {
    const productId = req.params.productId;

    const response = await axios.get(
      `http://localhost:8082/api/inventory/get/${productId}`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error in getProductDetailsFromInventory:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      res.status(404).send({
        success: false,
        message: "Product not Found",
      });
    }
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err),
      res.staus(500).send({
        success: false,
        message: "Error in Product-API.",
        err,
      });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not Found",
      });
    } else {
      res.status(200).send({
        success: true,
        product,
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in Get API Product.",
      err,
    });
  }
};

module.exports = {
  getProductDetailsFromInventory,
  getAllProducts,
  getProductById,
  createProductController,
  deleteProductController,
  productUpdateController,
  getProductDetails,
};
