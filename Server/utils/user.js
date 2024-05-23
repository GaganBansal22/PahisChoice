const jwt = require("jsonwebtoken")
const Product = require("../models/product");

module.exports.isUserLoggedIn = async (req, res, next) => {
    if (!res.locals.user)
        return res.send({ error: true, authenticated: false })
    next()
}

module.exports.verifyJwtForOTP = (req, res, next) => {
    try {
        if (!req.signedCookies.fpt)
            return res.send({ error: true, tokenExpired: true })
        let token = jwt.verify(req.signedCookies.fpt, process.env.jwt_secret_key);
        if (!token || token != req.body.email)
            return res.send({ error: true, tokenExpired: true })
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports.updateUserEmail = async (res, email) => {
    try {
        if (res.locals.user && res.locals.user) {
            res.locals.user.email = email;
            await res.locals.user.save()
            return { status: "success" }
        }
        else throw new Error("Error")
    } catch (error) {
        return { error: true }
    }
}

module.exports.getCartTotalAmountAndShippingCharge = async (req, res) => {
    let orderTotal = 0, shippingCharge = 0, products = [];
    try {
        if (res.locals.user.cart) {
            for (let product of res.locals.user.cart) {
                let p = await Product.findById(product.pid);
                if (p.qtyAvailable > 0) {
                    shippingCharge += p.fixedDeliveryFee
                    let qtyGiven = (p.qtyAvailable < product.qty ? p.qtyAvailable : product.qty)
                    shippingCharge += (qtyGiven - 1) * p.deliveryFeeIncrement
                    orderTotal += qtyGiven * p.price
                    products.push({ pid: product.pid, quantity: qtyGiven, sellingPrice: p.price, mrp: p.mrp })
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
    finally {
        return ({ orderTotal, shippingCharge, products })
    }
}

module.exports.generateOrderId = () => {
    const timestamp = Date.now().toString();
    const randomNumber = Math.floor(Math.random() * 10000).toString();
    return timestamp + '-' + randomNumber;
}