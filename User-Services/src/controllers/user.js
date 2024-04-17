const userModel = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrpyt = require("bcryptjs");
const axios = require("axios");

const getUserProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;
    const response = await axios.get(
      `http://localhost:8081/api/product/product-details/${productId}`
    );
    if (!response.data.success) {
      return res
        .status(404)
        .json({ success: false, message: response.data.message });
    }
    const product = response.data.product;
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error in getUserProductDetails:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addProductToInventory = async (req, res) => {
  try {
    const { name, price, size, design, quantity } = req.body;

    const response = await axios.post(
      "http://localhost:8081/api/product/create",
      { name, price, size, design, quantity }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error admin error",
    });
  }
};

const removeProductFromInventory = async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await axios.delete(
      `http://localhost:8081/api/product/delete/${productId}`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProductInInventory = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);

    if (!productId) {
      return res.status(404).send({
        success: false,
        message: "ProductID is Missing",
      });
    }
    const { name, price, size, design } = req.body;

    const response = await axios.put(
      `http://localhost:8081/api/product/update/${productId}`,
      { name, price, size, design }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllProductInInventory = async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/product/getall`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8084/api/cart/add-to-cart",
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const response = await axios.delete(
      `http://localhost:8084/api/cart/delete-to-cart/${productId}?userId=${req.body.id}`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const checkoutfromcart = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId)
    const response = await axios.post(
      `http://localhost:8084/api/cart/checkout/${userId}`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Not Enough Quantity we have of your selected product" });
  }
};

const RegisterController = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    console.log(userName, email, password, role)
    if (!userName || !email || !password) {
      return res.status(500).send({
        success: false,
        message: "All Fields are required",
      });
    }
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(500).send({
        success: false,
        message: "Email Already Registered",
      });
    }

    const salt = bcrpyt.genSaltSync(8);
    const HashedPassword = await bcrpyt.hash(password, salt);

    const User = await userModel.create({
      userName,
      email,
      password: HashedPassword,
      role,
    });


    res.status(201).send({
      success: true,
      message: "Successfully Registered",
    });

  } 
  catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      message: "Error in Register API"
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "All Fields are Required",
      });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not in Record",
      });
    }

    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).send({
      success: true,
      message: "Successfully Login",
      token,
    });
  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(500).send({
      success: false,
      message: "Error in LOGIN API",
      err,
    });
  }
};

module.exports = {
  getAllProductInInventory,
  updateProductInInventory,
  removeProductFromInventory,
  addProductToInventory,
  getUserProductDetails,
  RegisterController,
  loginController,
  checkoutfromcart,
  addToCart,
  removeFromCart,
};
