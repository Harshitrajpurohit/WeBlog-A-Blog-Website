const mongoose = require("mongoose");
const initdata = require("./data.js"); // Your array of initial comment data
const Comment = require("./Schema.js"); // Your Comment model

async function main() {
  try {
    // await mongoose.connect("mongodb://localhost:27017/WeBlog");
   console.log("Connected to DB");

    // Optionally clear existing comments
    // await Comment.deleteMany();

    // Insert many comments from initdata
    await Comment.insertMany(initdata);
    console.log("Comments added successfully");
  } catch (err) {
    console.error("Error during DB operation:", err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
