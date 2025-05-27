const mongoose = require("mongoose");
const inituserdata = require("./data.js");
const User = require("./schema.js");

async function main() {
    try {
        // Connect to the database
        await mongoose.connect("mongodb://localhost:27017/WeBlog", { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");

        // Initialize the database (insert data)
        await initDB();
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
}

// Function to insert data into the DB
const initDB = async () => {
    try {
        // Check if data is already present (optional to prevent duplicates)
        const existingUsers = await User.countDocuments();
        if (existingUsers === 0) {
            // Insert data only if the collection is empty
            await User.insertMany(inituserdata.data);
            console.log("Data added successfully");
        } else {
            console.log("Data already exists in the database.");
        }
    } catch (err) {
        console.error("Error inserting data:", err);
    }
};

// Start the process
main();
