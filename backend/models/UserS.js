const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // URL to profile image (optional)
      default: "https://cdn-icons-png.flaticon.com/128/456/456212.png",
    },
    role: {
      type: String,
      enum: ["Creator", "Reader"],
      default: "Reader", 
    },
    bio: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

module.exports = mongoose.model("User", userSchema);
