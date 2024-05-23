const User = require("../models/user")
const Product = require("../models/product");
const { getCartTotalAmountAndShippingCharge, generateOrderId } = require("../utils/user");
const Order = require("../models/order");
const { getInstaMojoToken } = require("../utils/home");

module.exports.addProductToCart = async (req, res) => {
    let pid = req.params.pid;
    let qtyrequested = parseInt(req.query.qty);
    if (qtyrequested < 0) {
        res.status = 400;
        return (res.send({ request: "declined" }))
    }
    if (qtyrequested > 5) qtyrequested = 5;
    try {
        // If User is logged in
        if (res.locals.user) {
            let user = await User.findByIdAndUpdate(res.locals.user._id, { $pull: { cart: { pid } } }, { new: true });
            if (qtyrequested > 0)
                user.cart.push({ pid: pid, qty: qtyrequested });
            await user.save();
            return res.send({ status: "success", numCartItems: user.cart.length });
        }
        // If User is not logged in
        else {
            if (req.session.cart) {
                req.session.cart = req.session.cart.filter((p) => { return (p.pid != pid) })
                if (qtyrequested > 0)
                    req.session.cart.push({ pid, qty: qtyrequested })
                if (req.session.cart.length == 0)
                    req.session.destroy()
            }
            else if (qtyrequested > 0)
                req.session.cart = [{ pid, qty: qtyrequested }]
            let numCartItems = (req.session && req.session.cart ? req.session.cart.length : 0)
            return res.send({ status: "success", numCartItems });
        }
    }
    catch (error) {
        res.send({ "error": true })
    }
}

module.exports.getCartProducts = async (req, res) => {
    try {
        let products = [];
        let qty = [];
        if (res.locals.user) {
            if (res.locals.user.cart) {
                for (let product of res.locals.user.cart) {
                    let p = await Product.findById(product.pid);
                    products.push(p);
                    qty.push(product.qty);
                }
            }
        }
        else if (req.session && req.session.cart) {
            for (let product of req.session.cart) {
                let p = await Product.findById(product.pid);
                products.push(p);
                qty.push(product.qty);
            }
        }
        res.send({ status: "success", products, qty });
    }
    catch (error) {
        res.send({ error: true })
    }
}

module.exports.checkout = async (req, res) => {
    try {
        let responseData = await getCartTotalAmountAndShippingCharge(req, res)
        res.send({ status: "success", orderTotal: responseData.orderTotal, shippingCharge: responseData.shippingCharge, addresses: res.locals.user.addresses });
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.payNow = async (req, res) => {
    try {
        let { addressIndex } = req.body
        let cartTotalAndShippingChargeData = await getCartTotalAmountAndShippingCharge(req, res)
        if (cartTotalAndShippingChargeData.orderTotal == 0)
            return res.send({ error: true, noItemsInCart: true })
        let instaMojoAccessToken = await getInstaMojoToken()
        let orderId = generateOrderId()
        const createPaymentOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${instaMojoAccessToken}`,
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                amount: cartTotalAndShippingChargeData.orderTotal + cartTotalAndShippingChargeData.shippingCharge,
                purpose: orderId,
                buyer_name: res.locals.user.fname + " " + res.locals.user.lname,
                email: res.locals.user.email,
                phone: res.locals.user.phone,
                redirect_url: process.env.CLIENT_ADDRESS + "/orderPage/" + orderId,
                // webhook: process.env.SERVER_ADDRESS+'/payment/instamojo-webhook',
                allow_repeated_payments: false,
                send_email: false,
            })
        };
        let createPaymentResponse = await fetch(`${process.env.INSTA_MOJO_URL}/v2/payment_requests/`, createPaymentOptions)
            .then(response => response.json())
        if (!createPaymentResponse.longurl)
            throw new Error("Payment url not generated")
        let newOrder = new Order({
            user: res.locals.user._id,
            paymentReceived: false,
            paymentRequestId: createPaymentResponse.id,
            userName: res.locals.user.addresses[addressIndex].name,
            userPhone: res.locals.user.addresses[addressIndex].phone,
            userAddress: res.locals.user.addresses[addressIndex].address,
            userPincode: res.locals.user.addresses[addressIndex].pincode,
            userCity: res.locals.user.addresses[addressIndex].city,
            userCountry: res.locals.user.addresses[addressIndex].country,
            userState: res.locals.user.addresses[addressIndex].state,
            orderId: orderId,
            subTotalAmount: cartTotalAndShippingChargeData.orderTotal,
            deliveryFeeAmount: cartTotalAndShippingChargeData.shippingCharge,
            totalAmount: cartTotalAndShippingChargeData.orderTotal + cartTotalAndShippingChargeData.shippingCharge,
            products: cartTotalAndShippingChargeData.products,
        })
        for (let product of cartTotalAndShippingChargeData.products) {
            let productFound = await Product.findById(product.pid)
            if (productFound) {
                productFound.qtyAvailable -= product.quantity;
                await productFound.save();
            }
        }
        await newOrder.save()
        res.send({ status: "success", paymentUrl: createPaymentResponse.longurl })
    } catch (error) {
        console.log(error)
        res.send({ error: true })
    }
}

module.exports.checkPaymentStatus = async (req, res) => {
    try {
        let { payment_id, orderId } = req.query;
        if (!payment_id || !orderId)
            return res.send({ error: true })
        let newOrder = await Order.findOne({ orderId: orderId })
        if (!newOrder)
            throw new Error("Order ID not found")
        else if (newOrder.status == 'Processing' && newOrder.status == 'Shipped' && newOrder.status == 'Delivered')
            return res.send({ status: "success", paymentSuccessfull: true })
        else if (newOrder.status == 'Cancelled')
            throw new Error("Order is already cancelled")
        else if (newOrder.status == 'Payment Failed')
            throw new Error("Payment already set to failed")
        let instaMojoAccessToken = await getInstaMojoToken()
        const getPaymentStatusOptions = {
            method: 'GET',
            headers: { accept: 'application/json', Authorization: `Bearer ${instaMojoAccessToken}` }
        };
        let paymentStatusResponse = await fetch(`${process.env.INSTA_MOJO_URL}/v2/payments/${payment_id}/`, getPaymentStatusOptions)
            .then(response => response.json())
        if (paymentStatusResponse.status) {
            newOrder.status = "Processing"
            newOrder.paymentId = paymentStatusResponse.id
            newOrder.paymentReceived = true;
            res.locals.user.cart = []
            await res.locals.user.save()
        }
        else {
            newOrder.status = "Payment Failed"
            newOrder.paymentId = paymentStatusResponse.id
            newOrder.products.map(async (product) => {
                let productFound = await Product.findById(product.pid)
                if (productFound) {
                    productFound.qtyAvailable += product.quantity;
                    await productFound.save();
                }
            })
        }
        await newOrder.save()
        res.send({ status: "success", paymentSuccessfull: paymentStatusResponse.status, numCartItems: res.locals.user.cart.length })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.buyNowAddresses = async (req, res) => {
    try {
        let { pid } = req.params
        let qtyrequested = parseInt(req.query.qty);
        let productToBeOrdered = await Product.findById(pid)
        if (!productToBeOrdered)
            return res.send({ error: true, productNotFound: true })
        if (productToBeOrdered.qtyAvailable == 0)
            return res.send({ error: true, ProductOutOfStock: true })
        let responseObject = {
            status: "success",
            addresses: res.locals.user.addresses,
            productPrice: productToBeOrdered.price,
            fixedDeliveryFee: productToBeOrdered.fixedDeliveryFee,
            deliveryFeeIncrement: productToBeOrdered.deliveryFeeIncrement
        }
        res.send(responseObject)
    } catch (error) {
        res.send({ erorr: true })
    }
}

module.exports.buyNowFunction = async (req, res) => {
    try {
        let { addressIndex, pid, qty } = req.body
        let productToBeOrdered = await Product.findById(pid)
        if (!productToBeOrdered)
            return res.send({ error: true, productNotFound: true })
        if (productToBeOrdered.qtyAvailable == 0)
            return res.send({ error: true, ProductOutOfStock: true })
        qty = productToBeOrdered.qtyAvailable < qty ? productToBeOrdered.qtyAvailable : qty;
        let orderSubtotal = qty * productToBeOrdered.price
        let shippingCharge = productToBeOrdered.fixedDeliveryFee
        shippingCharge += (qty - 1) * productToBeOrdered.deliveryFeeIncrement
        let instaMojoAccessToken = await getInstaMojoToken()
        let orderId = generateOrderId()
        const createPaymentOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${instaMojoAccessToken}`,
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                amount: orderSubtotal + shippingCharge,
                purpose: orderId,
                buyer_name: res.locals.user.fname + " " + res.locals.user.lname,
                email: res.locals.user.email,
                phone: res.locals.user.phone,
                redirect_url: process.env.CLIENT_ADDRESS + "/orderPage/" + orderId,
                // webhook: process.env.SERVER_ADDRESS+'/payment/instamojo-webhook',
                allow_repeated_payments: false,
                send_email: false,
            })
        };
        let createPaymentResponse = await fetch(`${process.env.INSTA_MOJO_URL}/v2/payment_requests/`, createPaymentOptions)
            .then(response => response.json())
        if (!createPaymentResponse.longurl)
            throw new Error("Payment url not generated")
        let newOrder = new Order({
            user: res.locals.user._id,
            paymentReceived: false,
            paymentRequestId: createPaymentResponse.id,
            userName: res.locals.user.addresses[addressIndex].name,
            userPhone: res.locals.user.addresses[addressIndex].phone,
            userAddress: res.locals.user.addresses[addressIndex].address,
            userPincode: res.locals.user.addresses[addressIndex].pincode,
            userCity: res.locals.user.addresses[addressIndex].city,
            userCountry: res.locals.user.addresses[addressIndex].country,
            userState: res.locals.user.addresses[addressIndex].state,
            orderId: orderId,
            subTotalAmount: orderSubtotal,
            deliveryFeeAmount: shippingCharge,
            totalAmount: orderSubtotal + shippingCharge,
            products: [{ pid: productToBeOrdered._id, quantity: qty, sellingPrice: productToBeOrdered.price, mrp: productToBeOrdered.mrp }],
        })
        productToBeOrdered.qtyAvailable -= qty;
        await newOrder.save()
        await productToBeOrdered.save();
        res.send({ status: "success", paymentUrl: createPaymentResponse.longurl })
    } catch (error) {
        res.send({ error: true })
    }
}

module.exports.updatePaymentStatus = async (req, res) => {

}