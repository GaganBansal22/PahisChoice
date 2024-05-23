const Review = require("../models/review")
const { cloudinary, storage } = require("../cloudinary");

module.exports.newReview = async (req, res) => {
    try {
        let { comment, rating,ptl } = req.body;
        let userReview=await Review.findOne({$and:[{ productTitle: ptl },{author:res.locals.user._id}]})
        comment = comment.trim();
        rating=parseInt(rating)
        if (rating <= 0)
            rating = 1;
        if (rating > 5)
            rating = 5;
        if(userReview){
            userReview.comment=comment
            userReview.rating=rating
            if(userReview.images){
                for(let f of userReview.images){
                    await cloudinary.uploader.destroy(f.filename)
                }
            }
            userReview.images=[]
        }
        else
            userReview=new Review({comment,rating,productTitle:ptl,author:res.locals.user._id});
        if(req.files)
            userReview.images=req.files.map(f => ({url:f.path,filename:f.filename}));
        await userReview.save();
        await userReview.populate({path: 'author',select: 'fname lname'});
        res.send({ status: "success",userReview })
    } catch (error) {
        console.log(error)
        res.send({ error: true })
    }
}