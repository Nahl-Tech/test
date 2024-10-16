import mongoose from "mongoose";

// Define the schema for the user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    }
});

// Creating the user model from the schema
const User = mongoose.model("User", userSchema);

export default User;
