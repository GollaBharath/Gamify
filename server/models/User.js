import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["Member", "Moderator", "Event Staff", "Admin", "Organisation"],
    default: "Member",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  points: {
    type: Number,
    default: 0,
  },
  

});

const User = mongoose.model("User", userSchema);

export default User;
