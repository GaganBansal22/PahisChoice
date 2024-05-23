const Admin = require("../models/admin")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Product = require("../models/product");
const Order = require("../models/order");
const { isValidObjectId } = require("mongoose");
const { cloudinary, storage } = require("../cloudinary");

module.exports.loginAdmin = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase()
        let admin = await Admin.findOne({ email });
        if (!admin || !(bcrypt.compareSync(password, admin.hash)))
            return res.send({ error: true, authenticated: false, incorectCredentials: "true" })
        const token = jwt.sign(admin._id.toString(), process.env.jwt_secret_key);
        res.cookie("_id", token, { httpOnly: true, signed: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        return res.send({ status: "success" })
    }
    catch (error) {
        res.send({ error: true, authenticated: false })
    }
}

module.exports.logoutAdmin = async (req, res) => {
    res.cookie("_id", 0, { httpOnly: true, signed: true, maxAge: 1 })
    res.send({ loggedOut: true })
}

module.exports.registerProduct = async (req, res) => {
    try {
        let { name,height,breadth,length,weight, size, color, qtyAvailable, price, description, mrp, category, subCategory, sub2Category, fixedDeliveryFee, deliveryFeeIncrement } = req.body;
        mrp = parseInt(mrp)
        price = parseInt(price)
        qtyAvailable = parseInt(qtyAvailable)
        name = name.trim()
        size = size.trim()
        color = color.trim()
        height = parseInt(height)
        length = parseInt(length)
        breadth = parseInt(breadth)
        weight = parseInt(weight)
        fixedDeliveryFee = parseInt(fixedDeliveryFee) || 0
        deliveryFeeIncrement = parseInt(deliveryFeeIncrement) || 0
        let discount = Math.ceil((mrp - price) / mrp * 100);
        let product = new Product({ name,length,breadth,height,weight, size, color, qtyAvailable, price, description, mrp, discount, category, subCategory, sub2Category, fixedDeliveryFee, deliveryFeeIncrement });
        product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        await product.save();
        return res.send({ status: "success", pid: product._id })
    }
    catch (error) {
        res.send({ error: true })
    }
}

module.exports.editProduct = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.pid))
            return res.send({ error: true, message: "Invalid Product id" });
        let product = await Product.findById(req.params.pid)
        if (!product)
            return res.send({ error: true, message: "Product not Found", notFound: true })
        let { name,height,breadth,length,weight, size, color, qtyAvailable, price, description, mrp, category, subCategory, sub2Category, fixedDeliveryFee, deliveryFeeIncrement } = req.body;
        mrp = parseInt(mrp)
        price = parseInt(price)
        qtyAvailable = parseInt(qtyAvailable)
        name = name.trim()
        size = size.trim()
        color = color.trim()
        height = parseInt(height)
        length = parseInt(length)
        breadth = parseInt(breadth)
        weight = parseInt(weight)
        fixedDeliveryFee = parseInt(fixedDeliveryFee) || 0
        deliveryFeeIncrement = parseInt(deliveryFeeIncrement) || 0
        let discount = Math.ceil((mrp - price) / mrp * 100);
        product = await Product.findByIdAndUpdate(req.params.pid, { height,breadth,length,weight,size, color, qtyAvailable, name, price, description, mrp, discount, category, subCategory, sub2Category, fixedDeliveryFee, deliveryFeeIncrement });
        if (req.files)
            product.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })));
        if (req.body.deleteImg && product.images.length == req.body.deleteImg.length)
            return res.send({ error: true, message: "Cannot delete all images" })
        else if (req.body.deleteImg) {
            for (let f of product.images) {
                if (req.body.deleteImg.includes(f.filename)) {
                    await cloudinary.uploader.destroy(f.filename)
                    await product.updateOne({ $pull: { images: { filename: f.filename } } });
                }
            }
        }
        await product.save();
        res.send({ status: "success" })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.getProductForEdit = async (req, res) => {
    if (!isValidObjectId(req.params.pid))
        return res.send({ error: true, message: "Invalid Product id" });
    let product = await Product.findById(req.params.pid)
    if (!product)
        return res.send({ error: true, message: "Product not Found", notFound: true })
    res.send({ status: "success", product: { ...product._doc } })
}

module.exports.forgotPassword = async (req, res) => {
    try {
        let { email, password1 } = req.body;
        let hashedPass = bcrypt.hashSync(password1, 12);
        await Admin.findOneAndUpdate({ email }, { hash: hashedPass })
        return res.send({ status: "success" })
    } catch (error) {
        return res.send({ error: true })
    }
}

module.exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const status = req.query.status;
        const pageSize = 50;
        const totalCount = await Order.countDocuments({ status: status });
        const totalPages = Math.ceil(totalCount / pageSize);
        const orders = await Order.find({ status: status })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();
        res.send({ status: "success", orderDetails: orders, currentPage: page, totalPages: totalPages });
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.getOrderDetails = async (req, res) => {
    try {
        let { oid } = req.params
        if (!oid)
            return res.send({ status: "success", orderNotFound: true })
        let orderFound = await Order.findOne({ orderId: oid })
            .populate({
                path: 'products.pid',
                select: '_id name price color size',
                populate: {
                    path: 'images',
                    model: 'Image',
                    options: { limit: 1 }
                }
            })
            .populate('user', 'email');
        if (!orderFound)
            return res.send({ status: "success", orderNotFound: true })
        res.send({ status: "success", orderDetails: orderFound })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.updateOrderStatus=async(req,res)=>{
    try {
        let { oid } = req.params
        let status = req.query.status;
        if (!oid)
            return res.send({ error:true, orderNotFound: true })
        let orderFound=await Order.findOneAndUpdate({orderId:oid},{status:status})
        if (!orderFound)
            return res.send({ status: "success", orderNotFound: true })
        res.send({ status: "success"})
    } catch (error) {
        res.send({ error: true })
    }
}