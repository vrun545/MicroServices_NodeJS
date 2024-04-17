const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DataBase");
  } catch (err) {
    console.log("Error in DataBase", err);
  }
};
module.exports = connectDb;
