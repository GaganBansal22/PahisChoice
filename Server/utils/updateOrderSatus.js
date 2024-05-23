const Order = require("../models/order");
const Product = require("../models/product");
const { getInstaMojoToken } = require("./home");

module.exports.updatePendingOrders = async () => {
    try {
        let fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
        // fiveHoursAgo = (new Date(Date.now() - 1 * 60 * 1000)); //for testing only
        const pendingOrders = await Order.find({
            status: 'Pending',
            createdAt: { $lte: fiveHoursAgo }
        });
        if (pendingOrders.length > 0) {
            let instaMojoAccessToken =await getInstaMojoToken()
            const paymentStatusOptions = {
                method: 'GET',
                headers: { accept: 'application/json', Authorization: `Bearer ${instaMojoAccessToken}` }
            };
            for (let order of pendingOrders) {
                let paymentStatusResponse = await fetch(`${process.env.INSTA_MOJO_URL}/v2/payment_requests/${order.paymentRequestId}/`, paymentStatusOptions)
                    .then(response => response.json())
                if (paymentStatusResponse.status != "Completed") {
                    order.status = 'Payment Failed';
                    order.products.map(async (product) => {
                        let productFound = await Product.findById(product.pid)
                        if (productFound) {
                            productFound.qtyAvailable += product.quantity;
                            await productFound.save();
                        }
                    })
                }
                else {
                    const getPaymentStatusOptionsForPaymentId = {
                        method: 'GET',
                        headers: { accept: 'application/json', Authorization: `Bearer ${instaMojoAccessToken}` }
                    };
                    for (let payment of paymentStatusResponse.payments) {
                        let paymentId = payment.split("/").filter(part => part !== "").pop()
                        let res = await fetch(`${process.env.INSTA_MOJO_URL}/v2/payments/${paymentId}/`, getPaymentStatusOptionsForPaymentId)
                            .then(response => response.json())
                        if (res.status) {
                            order.paymentId = paymentId
                            order.paymentReceived = true;
                            order.status = 'Processing';
                            break;
                        }
                    }
                }
                await order.save();
            }
        }
    } catch (error) {
        console.error("Error updating pending orders:", error);
    }
};