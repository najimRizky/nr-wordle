import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  country: {
    type: String,
  },
  stats: {
    total: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
  },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;