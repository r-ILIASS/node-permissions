// TODO: add db authentication

const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✓ MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = dbConnect;
