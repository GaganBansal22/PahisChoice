const Product = require("../models/product")
const Review = require("../models/review")
const User = require("../models/user")
const Admin = require("../models/admin")
const Otp = require("../models/otp")
const { isValidObjectId } = require("mongoose");
const { sendEmail } = require("../utils/home")
const jwt = require('jsonwebtoken');
const { updateUserEmail } = require("../utils/user")

module.exports.getLoginStatus = async (req, res) => {
    if (res.locals.user)
        return res.send({ authenticated: true, user: true, numCartItems: res.locals.user.cart.length })
    if (res.locals.admin)
        return res.send({ authenticated: true, admin: true })
    if (req.session && req.session.cart)
        return res.send({ authenticated: false, numCartItems: req.session.cart.length })
    res.send({ authenticated: false, numCartItems: 0 })
}

module.exports.getProduct = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.pid))
            return res.send({ error: true, message: "Product not found!", productNotFound: true })
        let product = await Product.findById(req.params.pid)
        let variants = await Product.find({ $and: [{ name: product.name }, { _id: { $ne: req.params.pid } }] })
        let userReview, allReviews,includedInWishList=false;
        if (res.locals.user) {
            userReview = await Review.findOne({ $and: [{ productTitle: product.name }, { author: res.locals.user._id }] }).populate({ path: 'author', select: 'fname lname' });
            allReviews = await Review.find({ $and: [{ productTitle: product.name }, { author: { $ne: res.locals.user._id } }] }).populate({ path: 'author', select: 'fname lname' });
        }
        else
            allReviews = await Review.find({ productTitle: product.name }).populate({ path: 'author', select: 'fname lname' });
        if(res.locals.user){
            res.locals.user.wishlist.forEach((item)=>{
                if(item.pid==req.params.pid)
                    includedInWishList=true;
            })
        }
        return res.send({ status: "success", product, variants, userReview, allReviews,includedInWishList })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.searchProducts = async (req, res) => {
    try {
        const q = req.query.q;
        const regex = new RegExp(q, 'i');
        const products = await Product.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { name: { $regex: regex } },
                                { description: { $regex: regex } },
                                { category: { $regex: regex } },
                                { subCategory: { $regex: regex } },
                                { sub2Category: { $regex: regex } },
                                { description: { $regex: regex } },
                            ],
                        },
                        { qtyAvailable: { $gt: 0 } },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'reviews', // Assuming the reviews collection name is 'reviews'
                    localField: 'name', // Assuming 'name' in products matches 'productTitle' in reviews
                    foreignField: 'productTitle',
                    as: 'reviews',
                },
            },
            {
                $group: {
                    _id: '$name', // Grouping by product name
                    doc: { $first: '$$ROOT' }, // Keeping the first occurrence of each unique product name
                },
            },
            {
                $replaceRoot: { newRoot: '$doc' }, // Replace the root document with the original document
            },
            {
                $project: {
                    _id: 1, name: 1, images: 1, price: 1, mrp: 1, discount: 1,
                    totalRatings: { $sum: '$reviews.rating' },
                    totalReviews: { $size: '$reviews' },
                },
            },
        ]);
        return res.send({ status: "success", products })
    }
    catch (error) {
        res.send({ error: true })
    }
}

module.exports.sendOTP = async (req, res) => {
    try {
        let { to, text, reset, isAdmin, notRegistered,checkIfUserRegistered } = req.body;
        to=to.toLowerCase()
        if (reset || checkIfUserRegistered) {
            let user = await User.findOne({ email: to });
            if (reset && !user)
                return res.send({ error: true, notRegistered: true })
            if(checkIfUserRegistered && user)
                return res.send({ error: true, alreadyRegistered: true })
        }
        if (notRegistered) {
            if (res.locals.user && res.locals.user.email == to)
                return res.send({ error: true, sameEmail: true })
            let user = await User.findOne({ email: to });
            if (user)
                return res.send({ error: true, registered: true })
        }
        if (isAdmin) {
            let admin = await Admin.findOne({ email: to });
            if (!admin)
                return res.send({ error: true, notRegistered: true })
        }
        let t = Math.floor(1000 + Math.random() * 9000);
        t = t.toString();
        const r = await sendEmail(to, "OTP from Pahi's Choice", `${text} ${t}\nOTP expires in 5 minutes`);
        if (r.status == "success") {
            await Otp.findOneAndReplace(
                { email: to },
                { email: to, otp: t },
                { upsert: true, new: true, runValidators: true }
            )
            return res.send({ status: "success" })
        }
        else throw new Error("Error")
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.verifyOTP = async (req, res) => {
    try {
        let { email, otp, updateEmail } = req.body;
        email=email.toLowerCase()
        let o = await Otp.findOne({ email })
        if (!o) return res.send({ error: true, otpExpired: true })
        if (o.otp == otp) {
            if (updateEmail) {
                let updated=await updateUserEmail(res,email);
                if(updated.status=="success")
                    return res.send({ status: "success", verified: true })
                throw new Error("Error")
            }
            else {
                const token = jwt.sign(email, process.env.jwt_secret_key);
                res.cookie("fpt", token, { httpOnly: true, signed: true, maxAge: 1000 * 60 * 10 })
            }
            return res.send({ status: "success", verified: true })
        }
        else
            return res.send({ status: "success", verified: false })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.getCategoryProducts = async (req, res) => {
    try {
        let { category, subCategory, sub2Category } = req.query;
        let matchStage;
        if (subCategory && sub2Category) {
            matchStage = {
                $match: {
                    $and: [
                        { category: category }, { subCategory: subCategory },
                        { sub2Category: sub2Category }, { qtyAvailable: { $gt: 0 } }
                    ]
                }
            };
        }
        else if (subCategory) {
            matchStage = {
                $match: {
                    $and: [
                        { category: category }, { subCategory: subCategory },
                        { qtyAvailable: { $gt: 0 } }
                    ]
                }
            };
        }
        else {
            matchStage = {
                $match: {
                    $and: [
                        { category: category }, { qtyAvailable: { $gt: 0 } }
                    ]
                }
            };
        }
        const products = await Product.aggregate([
            matchStage,
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'name',
                    foreignField: 'productTitle',
                    as: 'reviews',
                },
            },
            {
                $group: {
                    _id: '$name',
                    doc: { $first: '$$ROOT' },
                },
            },
            { $replaceRoot: { newRoot: '$doc' }, },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    images: 1,
                    price: 1,
                    mrp: 1,
                    discount: 1,
                    totalRatings: { $sum: '$reviews.rating' },
                    totalReviews: { $size: '$reviews' },
                },
            },
        ]);
        return res.send({ status: "success", products });
    } catch (error) {
        return res.send({ error: true });
    }
}

module.exports.getNewArrivals=async(req,res)=>{
    try {
        const last5Products = await Product.find().sort({ _id: -1 }).limit(4);
        res.send({status:"success",products:last5Products})
    } catch (error) {
        res.send({error:true})
    }
}