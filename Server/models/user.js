const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fname: "string",
    lname: "string",
    email: "string",
    hash: "string",
    phone: "number",
    addresses: [
        {
            address: "string",
            city:"string",
            state:"string",
            country:"string",
            name: "string",
            phone: "number",
            pincode: "number"
        }
    ],
    cart: [
        {
            pid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            qty: "number"
        }
    ],
    wishlist: [
        {
            pid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
})

module.exports = mongoose.model("User", UserSchema);