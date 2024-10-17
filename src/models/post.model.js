import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    url_name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }

});


const post = mongoose.model("post", postSchema);

export default post;
