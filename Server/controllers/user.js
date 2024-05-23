const User = require("../models/user")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Order = require("../models/order");
const Product = require("../models/product");

module.exports.registerUser = async (req, res) => {
    try {
        let { fname, lname, email, phone, address, password1, pincode, state, city, country } = req.body;
        email = email.toLowerCase()
        phone = parseInt(phone)
        // let Ruser = await User.findOne({ phone })
        let Ruser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
        if (Ruser)
            return res.send({ error: true, registered: "true" })
        let hashedPass = bcrypt.hashSync(password1, 12);
        let user = new User({ fname, lname, phone, hash: hashedPass, email });
        user.addresses.push({ name: `${fname} ${lname}`, address, pincode, phone, state, city, country })
        await user.save();
        if (req.session && req.session.cart) {
            for (let product of req.session.cart) {
                user.cart.push({ pid: product.pid, qty: product.qty });
            }
            await user.save();
        }
        if (req.session)
            req.session.destroy()
        const token = jwt.sign(user._id.toString(), process.env.jwt_secret_key);
        res.cookie("_id", token, { httpOnly: true, signed: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        return res.send({ status: "success", numCartItems: user.cart.length })
    }
    catch (error) {
        res.send({ error: true })
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase()
        let user = await User.findOne({ email: email });
        if (!user || !(bcrypt.compareSync(password, user.hash)))
            return res.send({ error: true, authenticated: false, incorectCredentials: "true" })
        if (req.session && req.session.cart) {
            for (let product of req.session.cart) {
                await user.updateOne({ $pull: { cart: { pid: product.pid } } })
                user.cart.push({ pid: product.pid, qty: product.qty });
            }
            await user.save();
        }
        if (req.session)
            req.session.destroy()
        const token = jwt.sign(user._id.toString(), process.env.jwt_secret_key);
        res.cookie("_id", token, { httpOnly: true, signed: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        return res.send({ status: "success", numCartItems: user.cart.length })
    }
    catch {
        res.send({ error: true, authenticated: false })
    }
}

module.exports.logoutUser = async (req, res) => {
    res.cookie("_id", 0, { httpOnly: true, signed: true, maxAge: 1 })
    res.send({ loggedOut: true })
}

module.exports.getUserAddresses = async (req, res) => {
    res.send({ status: "success", addresses: res.locals.user.addresses })
}

module.exports.editAddress = async (req, res) => {
    try {
        let { name, address, phone, pincode, index, state, city, country } = req.body;
        phone = parseInt(phone)
        pincode = parseInt(pincode)
        index = parseInt(index)
        name = name.trim()
        address = address.trim()
        state = state.trim()
        city = city.trim()
        if (!city || !state || !country || !name || !address || !phone || !pincode || index == undefined || index < 0 || index > 2 || index >= res.locals.user.addresses.length)
            throw new Error("Error")
        const updateFields = {
            $set: {
                [`addresses.${index}.name`]: name, [`addresses.${index}.address`]: address,
                [`addresses.${index}.pincode`]: pincode, [`addresses.${index}.phone`]: phone,
                [`addresses.${index}.state`]: state, [`addresses.${index}.city`]: city,
                [`addresses.${index}.country`]: country,
            }
        };
        let user = await User.findOneAndUpdate({ _id: res.locals.user._id }, updateFields, { new: true });
        return res.send({ status: "success", addresses: user.addresses })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.newAddress = async (req, res) => {
    try {
        if (res.locals.user.addresses.length >= 3) throw new Error("Error")
        let { name, address, phone, pincode, state, city, country } = req.body;
        phone = parseInt(phone)
        pincode = parseInt(pincode)
        name = name.trim()
        address = address.trim()
        if (!city || !state || !country || !name || !address || !phone || !pincode) throw new Error("Error")
        const user = await User.findOneAndUpdate({ _id: res.locals.user._id },
            {
                $push: {
                    addresses: {
                        $each: [{ name, address, phone, pincode, state, city, country }]
                    }
                }
            }, { new: true }
        );
        return res.send({ status: "success", addresses: user.addresses })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.deleteAddress = async (req, res) => {
    try {
        let { index } = req.body
        index = parseInt(index)
        if (index == undefined) throw new Error("Error")
        if (index >= res.locals.user.addresses.length) throw new Error("Error")
        await User.updateOne({ _id: res.locals.user._id }, { $pull: { addresses: { _id: res.locals.user.addresses[index]._id } } });
        return res.send({ status: "success" })
    } catch (error) {
        console.log(error)
        res.send({ error: true })
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        let { email, password1 } = req.body;
        email = email.toLowerCase()
        let hashedPass = bcrypt.hashSync(password1, 12);
        await User.findOneAndUpdate({ email }, { hash: hashedPass })
        return res.send({ status: "success" })
    } catch (error) {
        return res.send({ error: true })
    }
}

module.exports.getOrderDetails = async (req, res) => {
    try {
        let { oid } = req.params
        if (!oid)
            return res.send({ status: "success", orderNotFound: true })
        let orderFound = await Order.findOne({ orderId: oid, user: res.locals.user._id })
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

module.exports.updateAccountDetails = async (req, res) => {
    try {
        let { fname, lname, phone } = req.body;
        phone = parseInt(phone)
        res.locals.user.fname = fname
        res.locals.user.lname = lname
        res.locals.user.phone = phone
        await res.locals.user.save()
        return res.send({ status: "success" })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.getAccountDetailsForUpdate = async (req, res) => {
    try {
        return res.send({ status: "success", fname: res.locals.user.fname, lname: res.locals.user.lname, phone: res.locals.user.phone })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.getAllUserOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 20;
        const totalCount = await Order.countDocuments({ user: res.locals.user._id, status: { $nin: ['Payment Failed', 'Cancelled'] } });
        const totalPages = Math.ceil(totalCount / pageSize);
        const orders = await Order.find({ user: res.locals.user._id, status: { $nin: ['Payment Failed', 'Cancelled'] } })
            .populate({
                path: 'products.pid',
                model: 'Product'
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();
        res.send({ status: "success", orderDetails: orders, currentPage: page, totalPages: totalPages });
    } catch (error) {
        console.log(error)
        res.send({ error: true })
    }
}

module.exports.getAllUserFaliedOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 20;
        const totalCount = await Order.countDocuments({ user: res.locals.user._id, status: { $in: ['Payment Failed', 'Cancelled'] } });
        const totalPages = Math.ceil(totalCount / pageSize);
        const orders = await Order.find({ user: res.locals.user._id, status: { $in: ['Payment Failed', 'Cancelled'] } })
            .populate({
                path: 'products.pid',
                model: 'Product'
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();
        res.send({ status: "success", orderDetails: orders, currentPage: page, totalPages: totalPages });
    } catch (error) {
        console.log(error)
        res.send({ error: true })
    }
}

module.exports.addProductToWishlist = async (req, res) => {
    try {
        let { pid } = req.params
        let productFound = await Product.findById(pid)
        if (!productFound)
            return res.send({ error: true, productNotFound: true })
        let wishlist = res.locals.user.wishlist.filter(p => p.pid != pid);
        res.locals.user.wishlist = [{ pid: pid }, ...wishlist]
        await res.locals.user.save()
        res.send({ status: "success" })
    } catch (error) {
        console.log(error)
        res.send({ error: true })
    }
}

module.exports.deleteProductFromWishlist = async (req, res) => {
    try {
        let { pid } = req.params
        let wishlist = res.locals.user.wishlist.filter(p => p.pid != pid);
        res.locals.user.wishlist = [...wishlist]
        await res.locals.user.save()
        res.send({ status: "success" })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.getWishListProducts = async (req, res) => {
    try {
        const user = await User.findById(res.locals.user._id).populate({
            path: 'wishlist.pid',
            model: 'Product'
        }).exec();
        res.send({ status: "success", wishlist: user.wishlist })
    } catch (error) {
        console.log(error)
        res.send({ error: true })
    }
}