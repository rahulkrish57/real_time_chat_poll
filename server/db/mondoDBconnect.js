const mongoose = require("mongoose");

const database = () => {
  try {
    mongoose.connect(
      "mongodb+srv://rahulkrishdev:NEutHdCkvkVZe13d@test.diymzk3.mongodb.net/pollandchat?retryWrites=true&w=majority&appName=test"
    );
    console.log("::Database connection established::");
  } catch (error) {
    console.log("!!Database connection Failed!!");
  }
};

module.exports = database;
