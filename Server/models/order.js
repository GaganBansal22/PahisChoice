const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentReceived: {
        type: Boolean,
        default: false
    },
    paymentRequestId: "string",
    paymentId: "string",
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date
    },
    userName: "string",
    userAddress: "string",
    userState: "string",
    userCity: "string",
    userCountry: "string",
    userPhone: "number",
    userPincode: "number",
    orderId: "string",
    subTotalAmount: {
        type: Number,
        required: true
    },
    deliveryFeeAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Payment Failed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    products: [
        {
            pid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            sellingPrice: {
                type: Number,
                required: true
            },
            mrp: {
                type: Number,
                required: true
            },
        }
    ],
})

module.exports = mongoose.model("Order", OrderSchema);