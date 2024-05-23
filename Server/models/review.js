const mongoose=require("mongoose");

const ImageSchema=new mongoose.Schema({
    url:"string",
    filename:"string"
})

const reviewSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comment: "string",
    rating: "number",
    images: [ImageSchema],
    productTitle: "string"
})

module.exports= mongoose.model("Review",reviewSchema);