import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizationName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["user", "ngo"], 
    required: true
  },
});

const User = mongoose.model("User", userSchema);

export default User;
