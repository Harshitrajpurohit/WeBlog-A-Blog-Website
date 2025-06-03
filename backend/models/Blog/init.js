// const mongoose = require("mongoose");
// const initdata = require("./data.js");
// const Blog = require("./Schema.js");
// const { insertMany } = require("../BlogS.js");

// async function main() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/WeBlog");
//     console.log("Connected to DB");

//     // await Blog.deleteMany(); // optional: clear existing blogs
//     // console.log(initdata);
//     // await Blog.insertMany(initdata);
//     // console.log("Data added successfully");
//   } catch (err) {
//     console.error("Error during DB operation:", err);
//   } finally {
//     await mongoose.connection.close(); // closes connection when done
//   }
// }

// main();




// update schema

const mongoose = require("mongoose");
const Blog = require("./Schema.js"); // path to your Blog model

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/WeBlog");
    console.log("Connected to DB");

    // Update all documents: if `comments` doesn't exist, set it to []
    const result = await Blog.updateMany(
      { comments: { $exists: false } },
      { $set: { comments: [] } }
    );

    console.log(`Updated ${result.modifiedCount} documents to add 'comments' field.`);
  } catch (err) {
    console.error("Error updating documents:", err);
  } finally {
    await mongoose.connection.close();
  }
}

main();

